from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="files-home"),
    path("get", views.wrapfile, name="files-get"),
    path("timeline", views.timelineControlData, name="time-line"),
    path("darDatos", views.dar_datos, name="dar-datos"),
    path("nuevo-timeline", views.newTimeline, name="new-time-line"),
    path("peak-opeak", views.peakopeak, name="peaks-opeaks"),
    path("tpc-tm-car", views.tpctmcar, name="tpc-tm-car"),
    path("totalporzonas", views.totalPorZona, name="totalporzonas"),
    path("totalzonasportiempo", views.totalZonasPorTiempo, name="totalzonasportiempo"),
    path("globalminandmax", views.globalminandmax, name="globalminandmax"),
    path("minandmax", views.minandmax, name="minandmax"),
    path("newminandmax", views.new_min_max, name="newminandmax"),
    path("darindicadores", views.darIndicadores, name="darindicadores"),
]
