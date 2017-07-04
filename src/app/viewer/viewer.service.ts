import OpenSeadragon from "openseadragon";
import leaflet from "leaflet";

export interface IViewerService { }

export class ViewerService implements IViewerService {
    private viewer: any;
    private id: string;

    constructor() { }

    loadViewer(id: string) {
        this.id = id;
        // this.viewer = OpenSeadragon({
        //     id: id,
        //     prefixUrl: "resources/images/openseadragon/",
        //     showNavigator: true,
        //     tileSources: {
        //         crossOriginPolicy: "Anonymous",
        //         ajaxWithCredentials: false,
        //         Image: {
        //             xmlns: "http://schemas.microsoft.com/deepzoom/2008",
        //             Url: "https://openseadragon.github.io/example-images/highsmith/highsmith_files/",
        //             Format: "jpg",
        //             Overlap: "2",
        //             TileSize: "256",
        //             Size: {
        //                 Height: "9221",
        //                 Width: "7026"
        //             }
        //         }
        //     }
        // });

        // this.viewer.initializeAnnotations();
        // (<any>window).anno = this.viewer.annotations;
        // viewer.setFilterOptions({
        //     filters: {
        //         processors: [
        //             OpenSeadragon.Filters.CONTRAST(50),
        //             OpenSeadragon.Filters.GAMMA(50),
        //             OpenSeadragon.Filters.INVERT()
        //         ],
        //         loadMode: "sync"
        //     }
        // });
        
        /* leaflet */
        let view = leaflet.map("imgView2").setView(new leaflet.LatLng(0, 0), 0);

        leaflet.tileLayer.deepzoom("http://openseadragon.github.io/example-images/duomo/duomo_files/", {
            tolerance: 0.8,
            width: 13920,
            height: 10200
        }).addTo(view);

        let southWest = view.unproject([0, 10200], view.getMaxZoom()),
            northEast = view.unproject([13920, 0], view.getMaxZoom()),
            bounds = new leaflet.LatLngBounds(southWest, northEast);

		view.fitBounds(bounds);

        // let positron = leaflet.tileLayer("https://openseadragon.github.io/example-images/highsmith/highsmith_files/{z}/{x}_{y}.jpg").addTo(view);//http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
        // let marker = leaflet.marker([0, 0]).addTo(view);
    }

    clearAnnotations() {
        this.viewer.annotations.clean();
    }
}