from django.db import models


# Create your models here.
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)
    flag = models.ImageField(
    upload_to="country_flags/",
    null=True,
    blank=True
    )
    capital = models.CharField(max_length=100, blank=True)
    continent = models.CharField(max_length=20, blank=True)
    government_type = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True, help_text="Geographic center latitude for globe marker")
    longitude = models.FloatField(null=True, blank=True, help_text="Geographic center longitude for globe marker")

    def __str__(self):
        return self.name

    @property
    def code_2(self):
        from django_countries import countries
        return countries.alpha2(self.code.upper())


class CountryProfile(models.Model):
    country = models.OneToOneField(
        Country,
        on_delete=models.CASCADE
    )

    description = models.TextField(blank=True)
    history = models.TextField(blank=True)

    def __str__(self):
        return f"{self.country.name} Profile"
    

class InterestingFact(models.Model):
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name = "interesting_facts"
    )

    fact = models.TextField()

    def __str__(self):
        return f"{self.country.name} - Fact"


class Source(models.Model):
    country = models.ForeignKey(
        Country,
        on_delete = models.CASCADE,
        related_name = "sources"
    )

    title = models.CharField(max_length=200)
    url = models.URLField()
    published_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.country.name} - {self.title}"

class PoliticalParty(models.Model):
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name="political_parties"
    )

    name = models.CharField(max_length=150)
    abbreviation = models.CharField(max_length=20, blank=True)
    logo = models.ImageField(
    upload_to="party_logos/",
    null=True,
    blank=True
)
    founded_date = models.DateField(null=True, blank=True)
    ideology = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.country.name})"

class PoliticalLeader(models.Model):
    country = models.ForeignKey(
        Country,
        on_delete = models.CASCADE,
        related_name = "political_leaders"
    )

    party = models.ForeignKey(
        PoliticalParty,
        on_delete = models.SET_NULL,
        null = True,
        blank = True,
        related_name = "leaders"
    )

    name = models.CharField(max_length=150)
    photo = models.ImageField(upload_to="leaders/", blank=True, null=True)
    position = models.CharField(max_length=150)
    dat_of_birth = models.DateField(null=True, blank=True)
    biography = models.TextField(blank=True)
    term_start = models.CharField(max_length=100, blank=True, null=True, help_text="Start year/date of term (e.g. 2014 or May 2014)")
    term_end = models.CharField(max_length=100, blank=True, null=True, help_text="End year/date of term (e.g. 2019 or Present)")

    def __str__(self):
        return f"{self.name} - {self.position}"
    

class Election(models.Model):
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name = "elections"
    )

    name = models.CharField(max_length=200)
    election_date = models.DateField()
    election_type = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.country.name} - {self.name} ({self.election_date.year})"


class ElectionResult(models.Model):
    election = models.ForeignKey(
        Election,
        on_delete = models.CASCADE,
        related_name = "results"
    )

    party = models.ForeignKey(
        PoliticalParty,
        on_delete = models.CASCADE,
        related_name = "election_results"
    )

    votes = models.PositiveIntegerField(default=0)
    seats_won = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.party.name} - {self.election.name}"
    
    
    