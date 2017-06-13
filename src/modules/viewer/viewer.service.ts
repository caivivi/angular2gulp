import OpenSeadragon from "openseadragon";
import leaflet from "leaflet";

export interface IViewerService { }

export class ViewerService implements IViewerService {
    private viewer: any;
    private id: string;

    constructor() { }

    loadViewer(id: string) {
        this.id = id;
        this.viewer = OpenSeadragon({
            id: id,
            prefixUrl: "resources/images/openseadragon/",
            showNavigator: true,
            tileSources: {
                crossOriginPolicy: "Anonymous",
                ajaxWithCredentials: false,
                Image: {
                    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
                    Url: "https://openseadragon.github.io/example-images/highsmith/highsmith_files/",
                    Format: "jpg",
                    Overlap: "2",
                    TileSize: "256",
                    Size: {
                        Height: "9221",
                        Width: "7026"
                    }
                }
            }
        });

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
        let view = leaflet.map('imgView2', {
            minZoom: 0,
            maxZoom: 10
        }).setView([0, 0], 0);
        let positron = leaflet.tileLayer("https://openseadragon.github.io/example-images/highsmith/highsmith_files/{z}/{x}_{y}.jpg").addTo(view);//http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
        // let marker = leaflet.marker([0, 0]).addTo(view);
    }

    clearAnnotations() {
        this.viewer.annotations.clean();
    }
}