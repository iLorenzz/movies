from rest_framework import serializers
from .models import Rating

from .utils import build_poster_url


class SearchMovieResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    poster_path = serializers.SerializerMethodField()

    def get_poster_path(self, obj):
        return build_poster_url(obj.get('poster_path'))

class CastActorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class CreditsSerializer(serializers.Serializer):
    cast = CastActorSerializer(many=True)

class SearchMovieDetailsSerializer(serializers.Serializer):
    original_title = serializers.CharField()
    overview = serializers.CharField()
    poster_path = serializers.SerializerMethodField()
    release_date = serializers.CharField(allow_null=True, allow_blank=True)
    credits = CreditsSerializer()

    def get_poster_path(self, obj):
        return build_poster_url(obj.get('poster_path'))

class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rating
        fields = ['id','score', 'user_id', 'movie_id', 'created_at', 'updated_at']
        read_only_fields = ['id','created_at', 'user_id', 'updated_at']
