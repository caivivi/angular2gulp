import OpenSeadragon from "openseadragon";

export interface IViewerService { }

export class ViewerService implements IViewerService {
    private viewer: any;
    private id: string;

    constructor() { }

    loadViewer(id: string) {
        // console.log("map", leaflet, leaflet === (<any>window).L);
        // let view = leaflet.map('imgView').setView([51.505, -0.09], 13);
        // let marker = leaflet.marker([51.5, -0.09]).addTo(view);

        // let viewer = OpenSeadragon({
        //     id: "imgView",
        //     prefixUrl: "resources/images/openseadragon/",
        //     tileSources: "https://openseadragon.github.io/example-images/pnp/pan/6a32000/6a32400/6a32487_files/0/"
        // });
        
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

        this.viewer.initializeAnnotations();
        (<any>window).anno = this.viewer.annotations;

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
    }

    clearAnnotations() {
        this.viewer.annotations.clean();
    }
}