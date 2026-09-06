from django.shortcuts import render
from .models import Country


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
    country = Country.objects.get(id=country_id)

    context = {
        "country": country,
        "profile": getattr(country, "countryprofile", None),
        "facts": country.interesting_facts.all(),
        "parties": country.political_parties.all(),
        "leaders": country.political_leaders.all(),
        "elections": country.elections.all(),
        "sources": country.sources.all(),
        "all_countries": Country.objects.all(),
    }

    return render(
        request,
        "world_politics/country_detail.html",
        context
    )