import OpenSeadragon from "openseadragon";

export interface IViewerService { }

export class ViewerService implements IViewerService {
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
        
        let viewer = OpenSeadragon({
            id: id,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            showNavigator: true,
            tileSources: {
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
    }
}