from rest_framework import serializers



class SearchMovieResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    poster_path = serializers.CharField(allow_null=True, allow_blank=True)

class CastActorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class CreditsSerializer(serializers.Serializer):
    cast = CastActorSerializer(many=True)

class SearchMovieDetailsSerializer(serializers.Serializer):
    original_title = serializers.CharField()
    overview = serializers.CharField()
    poster_path = serializers.CharField(allow_null=True, allow_blank=True)
    release_date = serializers.CharField(allow_null=True, allow_blank=True)
    credits = CreditsSerializer()
