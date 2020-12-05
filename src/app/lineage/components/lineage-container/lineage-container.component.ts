import { Component, OnInit } from '@angular/core';
import ForceGraph3D from '3d-force-graph';

@Component({
  selector: 'lineage-container',
  templateUrl: './lineage-container.component.html',
  styleUrls: ['./lineage-container.component.less']
})
export class LineageContainerComponent implements OnInit {

  constructor() { }
  
  ngOnInit(): void {
        // Random tree
        const N = 300;
        const gData = {
          nodes: [...Array(N).keys()].map(i => ({ id: i })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round(Math.random() * (id-1))
            }))
        };
    
        const Graph = ForceGraph3D()
          (document.getElementById('3d-graph'))
            .graphData(gData);
  }
}
