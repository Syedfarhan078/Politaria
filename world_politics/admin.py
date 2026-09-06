from django.contrib import admin

from .models import (
    Country, 
    CountryProfile, 
    InterestingFact, 
    Source,
    PoliticalParty,
    PoliticalLeader,
    Election,
    ElectionResult,
)

# Register your models here.

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "capital", "continent", "government_type")
    search_fields = ("name", "code")
    list_filter = ("continent",)

@admin.register(CountryProfile)
class CountryProfileAdmin(admin.ModelAdmin):
    list_display = ("country",)
    search_fields = ("country__name",)


@admin.register(InterestingFact)
class InterestingFactAdmin(admin.ModelAdmin):
    list_display = ("country", "fact")
    search_fields = ("country__name", "fact")
    list_filter = ("country",)


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ("country", "title", "published_date")
    search_fields = ("country__name", "title")
    list_filter = ("country",)


@admin.register(PoliticalParty)
class PoliticalPartyAdmin(admin.ModelAdmin):
    list_display = ("name", "abbreviation", "country")
    search_fields = ("name", "abbreviation", "country__name")
    list_filter = ("country",)

@admin.register(PoliticalLeader)
class PoliticalLeaderAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "country", "party")
    search_fields = ("name", "country__name", "party__name")
    list_filter = ("country", "party")


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "election_date", "election_type")
    search_fields = ("name", "country__name")
    list_filter = ("country", "election_type")


@admin.register(ElectionResult)
class ElectionResultAdmin(admin.ModelAdmin):
    list_display = ("election", "party", "votes", "seats_won")
    search_fields = ("election__name", "party__name")
    list_filter = ("election", "party")

