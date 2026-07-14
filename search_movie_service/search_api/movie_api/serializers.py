from rest_framework import serializers



class SearchMovieResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    poster_path = serializers.CharField(allow_null=True, allow_blank=True)
    release_date = serializers.CharField(allow_null=True, allow_blank=True)
    overview = serializers.CharField()
