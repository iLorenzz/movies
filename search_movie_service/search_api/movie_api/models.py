from django.db import models
from django.conf import settings



class Rating(models.Model):
    score = models.PositiveSmallIntegerField()

    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ratings'
    )

    movie_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        unique_together = ('user_id', 'movie_id')


