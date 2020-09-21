from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import json
import pandas as pd
from os import listdir
from os.path import isfile, join
import sys

# Create your views here.
main_path = "/mnt/suyt_storage/uploads/etl"


def home(request):
    return HttpResponse("<h1> Files home </h1>")


def minandmax(req):
    subfolder = req.GET.get("subfolder", "global")
    filename = "docs/escenario1/accesibility_ij_resumen/{}minandmax.json".format(
        subfolder
    )
    try:
        with open(filename, "r") as file:
            file_data = file.read()
            return HttpResponse(file_data)
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )


def totalZonasPorTiempo(req):
    zonasReq = req.GET.get("zonas", "todas")
    modo = req.GET.get("modo", "agregado")
    tiempo = req.GET.get("tiempo", "0")
    filename = "docs/escenario1/accesibility_ij_resumen/totalZonaPorTiempo/t_{}.json".format(
        tiempo
    )
    if modo == "agregado":
        totalData = {"value": 0}
    else:
        totalData = []
    try:
        with open(filename, "r") as file:
            file_data = file.read()
            data = json.loads(file_data)
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )

    if zonasReq == "todas":
        zonas = range(0, 128)
    else:
        zonas = zonasReq.split("$")

    print("zonas", zonas)

    for zona in zonas:
        try:
            zonaInt = int(zona)
        except:
            return HttpResponse(
                json.dumps({"error": "revisar zonas"}), content_type="application/json"
            )
        if modo == "agregado":
            totalData["value"] += data[zonaInt]["value"] / len(zonas)
        else:
            totalData += [dato for dato in data if dato["zone"] == zonaInt]

    return HttpResponse(json.dumps(totalData), content_type="application/json")


def globalminandmax(req):
    filename = "docs/escenario1/accesibility_ij_resumen/globalminandmax.json"
    try:
        with open(filename, "r") as file:
            file_data = file.read()
            return HttpResponse(file_data)
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )


def totalPorZona(req):
    zonasReq = req.GET.get("zonas", "todas")
    modo = req.GET.get("modo", "agregado")
    filename = "docs/escenario1/accesibility_ij_resumen/totalporzonas.json"
    if modo == "agregado":
        totalData = {"value": 0}
    else:
        totalData = []
    try:
        with open(filename, "r") as file:
            file_data = file.read()
            data = json.loads(file_data)
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )

    if zonasReq == "todas":
        zonas = range(0, 128)
    else:
        zonas = zonasReq.split("$")

    print("zonas", zonas)

    for zona in zonas:
        try:
            zonaInt = int(zona)
        except:
            return HttpResponse(
                json.dumps({"error": "revisar zonas"}), content_type="application/json"
            )
        if modo == "agregado":
            totalData["value"] += data[zonaInt]["value"] / len(zonas)
        else:
            totalData += [dato for dato in data if dato["zone"] == zonaInt]

    return HttpResponse(json.dumps(totalData), content_type="application/json")


def tpctmcar(req):
    tiemposReq = req.GET.get("tiempos", "todos")
    modo = req.GET.get("modo", "agregado")
    filename = "docs/escenario1/accesibility_ij_resumen/tpctmcar.json"
    if modo == "agregado":
        totalData = {"tpc": 0, "tm": 0, "car": 0}
    else:
        totalData = []
    try:
        with open(filename, "r") as file:
            file_data = file.read()
            data = json.loads(file_data)
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )

    if tiemposReq == "todos":
        tiempos = range(0, 42)
    else:
        tiempos = tiemposReq.split("$")

    print("tiempos", tiempos)

    for tiempo in tiempos:
        try:
            tiempoInt = int(tiempo)
        except:
            return HttpResponse(
                json.dumps({"error": "revisar tiempos"}),
                content_type="application/json",
            )
        if modo == "agregado":
            totalData["tpc"] += data[tiempoInt]["tpc"] / len(tiempos)
            totalData["tm"] += data[tiempoInt]["tm"] / len(tiempos)
            totalData["car"] += data[tiempoInt]["car"] / len(tiempos)
        else:
            totalData += [dato for dato in data if dato["time"] == tiempoInt]

    return HttpResponse(json.dumps(totalData), content_type="application/json")


def peakopeak(req):
    tiemposReq = req.GET.get("tiempos", "todos")
    modo = req.GET.get("modo", "agregado")
    filename = "docs/escenario1/accesibility_ij_resumen/peaksopeaks.json"
    if modo == "agregado":
        totalData = {"peak": 0, "opeak": 0}
    else:
        totalData = []
    try:
        with open(filename, "r") as file:
            file_data = file.read()
            data = json.loads(file_data)
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )

    if tiemposReq == "todos":
        tiempos = range(0, 42)
    else:
        tiempos = tiemposReq.split("$")

    print("tiempos", tiempos)

    for tiempo in tiempos:
        try:
            tiempoInt = int(tiempo)
        except:
            return HttpResponse(
                json.dumps({"error": "revisar tiempos"}),
                content_type="application/json",
            )
        if modo == "agregado":
            totalData["peak"] += data[tiempoInt]["peak"] / len(tiempos)
            totalData["opeak"] += data[tiempoInt]["opeak"] / len(tiempos)
        else:
            totalData += [dato for dato in data if dato["time"] == tiempoInt]

    return HttpResponse(json.dumps(totalData), content_type="application/json")


def newTimeline(req):
    zonas = req.GET.get("zonas", "todas")

    totalData = []
    print("jeje", zonas)
    zonas = zonas.split("$")
    print("jeje2", zonas)

    try:
        for zona in zonas:
            filename = "docs/escenario1/accesibility_ij_resumen/timelines/timeline_{}.json".format(
                zona
            )
            with open(filename, "r") as file:
                file_data = file.read()
                data = json.loads(file_data)
                print("data")
                print(data)
                totalData += data

        return HttpResponse(json.dumps(totalData), content_type="application/json")

    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )


def heatmap_nueva_version(req):
    tiempo = req.GET.get("tiempo", "0")
    escenario = req.GET.get("escenario")
    indicador = req.GET.get("indicador", "accessibility ij")
    subscripts = req.GET.get("subcripts", "car|opeak")

    if " ij" not in indicador:
        return HttpResponse(
            json.dumps({"err": "el archivo no es ij"}), content_type="application/json"
        )

    try:
        filename = "{}/{}/{}-{}-{}.csv".format(
            main_path, escenario, indicador, subscripts, tiempo
        )
        if ".json" in filename:
            with open(filename, "r") as file:
                file_data = json.load(file)
                for fd in file_data:
                    fd["value"] = fd["subscripts"]
                print(file_data)
                return HttpResponse(
                    json.dumps(file_data), content_type="application/json"
                )
        elif ".csv" in filename:
            df = pd.read_csv(filename)
            return HttpResponse(
                df.to_json(orient="records"), content_type="application/json"
            )

    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": str(sys.exc_info())}), content_type="application/json"
        )


def heatmap(req):
    mintime = req.GET.get("mintime", "0")
    maxtime = req.GET.get("maxtime", "41")

    try:
        data = [None] * 128 * 128
        veces = [1] * 128 * 128
        mintime = int(mintime)
        maxtime = int(maxtime)

        print("min and max time", mintime, maxtime)

        for time in range(mintime, maxtime + 1):
            filename = "docs/escenario1/accesibility_ij_resumen/heatmap/heatmap_t{}.json".format(
                time
            )
            with open(filename, "r") as file:
                file_data = file.read()
                prevdata = json.loads(file_data)
                for index, dato in enumerate(prevdata):
                    if dato["zi"] == "a0" or dato["zj"] == "a0":
                        continue
                    elif data[index] is None:
                        data[index] = dato
                    else:
                        veces[index] += 1
                        data[index]["value"] += dato["value"]
        # aqui estamos diviendo cada dato por su frecuencia
        for index in range(len(data)):
            if data[index] is None:
                continue
            else:
                data[index]["value"] /= veces[index]
        print("veces", min(veces), max(veces))

        return HttpResponse(
            json.dumps([d for d in data if d is not None]),
            content_type="application/json",
        )
    except:
        print("error - error: ", sys.exc_info())
        return HttpResponse(
            json.dumps({"err": sys.exc_info()}), content_type="application/json"
        )


def waprfile(request):
    escenarios = request.GET.get("escenarios", "6").split("$")
    nombres = request.GET.get("nombres", "slow_tours_i").split("$")
    zonas = request.GET.get("zonas", None)
    zonasRangos = request.GET.get("zonas-rangos", None)
    modos = request.GET.get("modos", "tpc").split("$")
    tipos = request.GET.get("tipos", "peak").split("$")
    attrs = request.GET.get("attrs", "false")
    csv = request.GET.get("csv", "false")
    data = []

    if zonas != None:
        zonas = zonas.split("$")
    else:
        zonas = []

    if zonasRangos != None:
        print("entrando")
        for zonasRango in zonasRangos.split("$"):
            if ("-" in zonasRango) and (len(zonasRango.split("-")) == 2):
                zonaMin = zonasRango.split("-")[0]
                zonaMax = zonasRango.split("-")[1]
                try:
                    zonas += [
                        i
                        for i in range(
                            min(int(zonaMin), int(zonaMax) + 1),
                            max(int(zonaMin), int(zonaMax) + 1),
                        )
                    ]
                except:
                    continue

    zonasPar = []
    for i in zonas:
        zonasPar += ["a{0},a{1}".format(i, j) for j in zonas]

    zonas += zonasPar

    if attrs != "false":
        for escenario in escenarios:
            for nombre in nombres:
                for zona in zonas:
                    for modo in modos:
                        for tipo in tipos:
                            file_location = "docs/{0}/{1}[{2},{3},{4}].json".format(
                                escenario, nombre, zona, modo, tipo
                            )
                            print("file", file_location)
                            try:
                                with open(file_location, "r") as f:
                                    file_data = f.read()
                                    prevdata = json.loads(file_data)
                                    for p in prevdata:
                                        p["escenario"] = escenario
                                    data += prevdata

                            except IOError:
                                print("archivo no encontrado", file_location)
                                continue
    for escenario in escenarios:
        for nombre in nombres:
            file_location = "docs/{0}/{1}.json".format(escenario, nombre)
            print("file", file_location)
            try:
                with open(file_location, "r") as f:
                    file_data = f.read()
                    data += json.loads(file_data)

            except IOError:
                print("archivo no encontrado", file_location)
                continue

    if len(data) == 0:
        response = HttpResponseNotFound("<h1>File not exist</h1>")
    else:
        if csv != "false":
            # sending response
            acc_ij_df = pd.DataFrame(data)
            response = HttpResponse(
                acc_ij_df.to_csv(index=None), content_type="text/csv"
            )
            response["Content-Disposition"] = 'attachment; filename="foo.csv"'
        else:
            response = HttpResponse(json.dumps(data), content_type="application/json")

    return response


def validatePath(path, attrs):
    ret = True
    return True
    for attr in attrs:
        ret = ret and attr in path

    return ret


def timelineControlData(req):
    all = req.GET.get("all", False)
    escenario = req.GET.get("escenario", 1)
    nombre = req.GET.get("nombre", "slow")
    attrs = req.GET.get("attrs", "tpc$opeak").split("$")
    dat = pd.DataFrame([{"value": 0}] * 42)

    onlyfiles = [
        f
        for f in listdir("docs/escenario{0}/".format(escenario))
        if isfile(join("docs/escenario{0}/".format(escenario), f))
        and nombre in f
        and validatePath(f, attrs)
    ]

    try:
        print("one path")
        print(onlyfiles)
    except:
        print("len paths")
        print(len(onlyfiles))
    for filename in onlyfiles:
        try:
            file = pd.read_json("docs/escenario{0}/{1}".format(escenario, filename))
            dat["value"] += file["value"] / len(onlyfiles)
        except:
            continue
    # print("dat ***")
    # print(dat)

    try:
        return HttpResponse(
            dat.to_json(orient="records"), content_type="application/json"
        )
    except:
        return HttpResponse(json.dumps(onlyfiles), content_type="application/json")

