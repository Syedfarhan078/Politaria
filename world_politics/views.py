from django.shortcuts import render, get_object_or_404
from django.db.models import Prefetch
from .models import Country, PoliticalLeader, Election, ElectionResult


def index(request):
    search_query = request.GET.get("search", "")
    continent_filter = request.GET.get("continent", "")

    countries = Country.objects.all()

    if search_query:
        countries = countries.filter(
            name__icontains=search_query
        )

    if continent_filter:
        countries = countries.filter(
            continent=continent_filter
        )

    continents = (
        Country.objects
        .values_list("continent", flat=True)
        .distinct()
        .order_by("continent")
    )

    return render(
        request,
        "world_politics/index.html",
        {
            "countries": countries,
            "search_query": search_query,
            "continent_filter": continent_filter,
            "continents": continents,
        }
    )


def country_detail(request, country_id):
    country = get_object_or_404(
        Country.objects
        .select_related("countryprofile")
        .prefetch_related(
            "interesting_facts",
            "political_parties",
            Prefetch(
                "political_leaders",
                queryset=PoliticalLeader.objects.select_related("party")
            ),
            Prefetch(
                "elections",
                queryset=Election.objects.prefetch_related(
                    Prefetch(
                        "results",
                        queryset=ElectionResult.objects.select_related("party")
                    )
                )
            ),
            "sources",
        ),
        id=country_id
    )

    all_countries = Country.objects.only("id", "name", "continent", "code", "latitude", "longitude")

    context = {
        "country": country,
        "profile": getattr(country, "countryprofile", None),
        "facts": country.interesting_facts.all(),
        "parties": country.political_parties.all(),
        "leaders": country.political_leaders.all(),
        "elections": country.elections.all(),
        "sources": country.sources.all(),
        "all_countries": all_countries,
    }

    return render(
        request,
        "world_politics/country_detail.html",
        context
    )
