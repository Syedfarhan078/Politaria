/**
 * Politaria - High-Performance Country Detail Interactive 3D Globe
 * Built with Globe.gl (Three.js WebGL)
 * 
 * Performance Optimizations:
 * 1. Clamped DevicePixelRatio (1.5 max) - smooth GPU performance
 * 2. Instant Transition (polygonsTransitionDuration: 0) - eliminates CPU-heavy tween loop
 * 3. Hover Guard (hoverFeature === hoverD check) - eliminates 99.9% redundant hover updates
 * 4. Precomputed Country Cache (__dbInfo, __isCurrent) - instant O(1) lookups
 * 5. IntersectionObserver Auto-Pause - pauses WebGL render loop when reading dossier content below
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('detail-globe-container');
        if (!container) return;

        const currentCode = (container.getAttribute('data-country-code') || '').toUpperCase();
        const targetLat = parseFloat(container.getAttribute('data-country-lat')) || 0;
        const targetLng = parseFloat(container.getAttribute('data-country-lng')) || 0;

        // Parse Django country dictionary
        let djangoCountries = {};
        const dataScript = document.getElementById('django-countries-data');
        if (dataScript) {
            try {
                djangoCountries = JSON.parse(dataScript.textContent);
            } catch (e) {
                console.error('Detail Globe: Error parsing Django countries data:', e);
            }
        }

        const countryLookup = {};
        Object.keys(djangoCountries).forEach(code => {
            const c = djangoCountries[code];
            const upperCode = code.toUpperCase();
            countryLookup[upperCode] = c;
            if (c.name) {
                countryLookup[c.name.toLowerCase()] = c;
            }
        });

        // Common ISO aliases
        countryLookup['USA'] = countryLookup['USA'] || countryLookup['United States'] || countryLookup['United States of America'];
        countryLookup['GBR'] = countryLookup['GBR'] || countryLookup['United Kingdom'];
        countryLookup['FRA'] = countryLookup['FRA'] || countryLookup['France'];
        countryLookup['PSE'] = countryLookup['PSE'] || countryLookup['PSX'] || countryLookup['Palestine'];
        countryLookup['PSX'] = countryLookup['PSE'];

        function isCurrentCountry(feat) {
            if (!feat || !feat.properties) return false;
            const p = feat.properties;
            const iso = (p.ISO_A3 || '').toUpperCase();
            const adm = (p.ADM0_A3 || '').toUpperCase();
            const su = (p.SU_A3 || '').toUpperCase();

            return iso === currentCode || adm === currentCode || su === currentCode;
        }

        function getCountryInfo(feat) {
            if (!feat || !feat.properties) return null;
            const p = feat.properties;
            const iso = (p.ISO_A3 || '').toUpperCase();
            const adm = (p.ADM0_A3 || '').toUpperCase();
            const su = (p.SU_A3 || '').toUpperCase();
            const name = (p.ADMIN || p.NAME || '').toLowerCase();

            return countryLookup[iso] || countryLookup[adm] || countryLookup[su] || countryLookup[name] || null;
        }

        const width = container.clientWidth || 170;
        const height = container.clientHeight || 170;

        let hoverD = null;

        // Initialize Globe.gl in detail mode
        const globe = Globe()(container)
            .width(width)
            .height(height)
            .backgroundColor('rgba(0,0,0,0)')
            .showAtmosphere(true)
            .atmosphereColor('#cbd5e1')
            .atmosphereAltitude(0.15)
            .polygonsTransitionDuration(0) // Performance: Eliminate CPU tween loop
            // Elevated altitude for active country
            .polygonAltitude(d => {
                if (d.__isCurrent) return 0.07;
                if (d === hoverD) return 0.045;
                return d.__dbInfo ? 0.012 : 0.005;
            })
            // Crimson red for active country, muted for others
            .polygonCapColor(d => {
                if (d.__isCurrent) return '#be123c';
                if (d === hoverD) return '#f43f5e';
                return d.__dbInfo ? '#ffffff' : '#e2e8f0';
            })
            .polygonSideColor(d => {
                if (d.__isCurrent) return '#881337';
                if (d === hoverD) return '#9f1239';
                return '#cbd5e1';
            })
            .polygonStrokeColor(d => {
                if (d.__isCurrent || d === hoverD) return '#ffffff';
                return '#94a3b8';
            })
            // Tooltip
            .polygonLabel(d => {
                const p = d.properties || {};
                const dbInfo = d.__dbInfo;
                const isSelected = d.__isCurrent;
                const displayName = dbInfo ? dbInfo.name : (p.ADMIN || p.NAME || 'Unknown');
                const displayContinent = dbInfo ? dbInfo.continent : (p.CONTINENT || '');

                return `
                    <div style="
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid ${isSelected ? '#f43f5e' : 'rgba(255, 255, 255, 0.15)'};
                        border-radius: 10px;
                        padding: 8px 12px;
                        color: #ffffff;
                        font-family: 'Inter', system-ui, -apple-system, sans-serif;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
                        pointer-events: none;
                        min-width: 120px;
                    ">
                        <div style="font-size: 12px; font-weight: 800; font-family: 'Playfair Display', serif; color: #ffffff;">
                            ${displayName}
                        </div>
                        <div style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #fda4af; margin-top: 2px;">
                            ${displayContinent}
                        </div>
                        ${isSelected ? `
                            <div style="margin-top: 5px; font-size: 8.5px; font-weight: 700; color: #fb7185; text-transform: uppercase; letter-spacing: 0.1em;">
                                ● Active Dossier
                            </div>
                        ` : (dbInfo ? `
                            <div style="margin-top: 5px; font-size: 8.5px; font-weight: 600; color: #38bdf8;">
                                Switch to Profile →
                            </div>
                        ` : '')}
                    </div>
                `;
            })
            // High-Performance Hover with guard
            .onPolygonHover(hoverFeature => {
                if (hoverFeature === hoverD) return; // Performance: Skip redundant frames
                hoverD = hoverFeature;

                globe
                    .polygonAltitude(d => d.__isCurrent ? 0.07 : (d === hoverD ? 0.045 : (d.__dbInfo ? 0.012 : 0.005)))
                    .polygonCapColor(d => d.__isCurrent ? '#be123c' : (d === hoverD ? '#f43f5e' : (d.__dbInfo ? '#ffffff' : '#e2e8f0')))
                    .polygonStrokeColor(d => (d.__isCurrent || d === hoverD) ? '#ffffff' : '#94a3b8');

                if (hoverFeature) {
                    container.style.cursor = hoverFeature.__dbInfo && !hoverFeature.__isCurrent ? 'pointer' : 'default';
                } else {
                    container.style.cursor = 'grab';
                }
            })
            // Click to switch country
            .onPolygonClick(feature => {
                if (!feature || !feature.__dbInfo || !feature.__dbInfo.url || feature.__isCurrent) return;
                window.location.href = feature.__dbInfo.url;
            });

        // Optimize GPU fill-rate
        if (globe.renderer && typeof globe.renderer === 'function') {
            const renderer = globe.renderer();
            if (renderer && renderer.setPixelRatio) {
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
            }
        }

        // Set ocean sphere color
        try {
            if (globe.globeMaterial && typeof globe.globeMaterial === 'function') {
                const mat = globe.globeMaterial();
                if (mat && mat.color) {
                    mat.color.set('#1e293b');
                }
            }
        } catch (e) {
            console.warn('Detail Globe: Could not set globeMaterial color:', e);
        }

        // Auto-rotation STOPPED on detail page
        const controls = globe.controls();
        if (controls) {
            controls.autoRotate = false;
            controls.enableZoom = true;
            controls.minDistance = 120;
            controls.maxDistance = 450;
        }

        // Apply polygon geometry with precalculated cache
        function applyPolygons(geoData) {
            if (geoData && geoData.features) {
                geoData.features.forEach(f => {
                    f.__dbInfo = getCountryInfo(f);
                    f.__isCurrent = isCurrentCountry(f);
                });
                globe.polygonsData(geoData.features);
            }
        }

        if (window.WORLD_POLYGONS && window.WORLD_POLYGONS.features) {
            applyPolygons(window.WORLD_POLYGONS);
        } else {
            fetch('/static/world_politics/data/countries.geojson')
                .then(res => res.json())
                .then(data => applyPolygons(data))
                .catch(err => console.error('Detail Globe: Error loading GeoJSON:', err));
        }

        // Smooth camera glide to face the selected country (1200ms)
        const startLat = targetLat > 0 ? targetLat - 25 : targetLat + 25;
        const startLng = targetLng - 50;
        globe.pointOfView({ lat: startLat, lng: startLng, altitude: 2.2 });

        setTimeout(() => {
            globe.pointOfView({ lat: targetLat, lng: targetLng, altitude: 1.75 }, 1200);
        }, 150);

        // Auto-pause when user scrolls down to read long dossier sections
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        globe.resumeAnimation();
                    } else {
                        globe.pauseAnimation();
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(container);
        }

        // Responsive resize
        window.addEventListener('resize', () => {
            const w = container.clientWidth || 170;
            const h = container.clientHeight || 170;
            globe.width(w).height(h);
        });

        console.log('Politaria: High-performance Detail Globe ready for:', currentCode);
    });
})();
