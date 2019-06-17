import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockServerService } from './mock-server.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EChartOption } from 'echarts';
import { gexf } from 'echarts/extension/dataTool';
import * as moment from 'moment';

moment.locale();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  options = {
    textStyle: {
      color: '#000',
    },
    xAxis: {
      type: 'category',
      data: ['10/06', '11/06', '12/06', '13/06', '14/06', '15/06', '16/06', '17/06', '18/06', '19/06', '20/06', '21/06', '22/06'],
      axisLine: {
        lineStyle: {
          color: '#000',
          width: 2,
          type: 'solid',
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#000',
          width: 2,
          type: 'solid',
        }
      }
    },
    series: [{
      symbol: 'circle',
      itemStyle: {
        color: '#4B92E1',
        borderColor: null,
      },
      data: [3, 6.5, 3.8, 5, 5, 6.8, 4.2, 6.8, 4.3, 6, 5, 5, 6.7],
      type: 'line',
      smooth: false,
      symbolSize: 18,
    }]
  };

  initialCount: Array<any> = [];

  mergeOption: any;
  loading = false;


  graphOption: Observable<EChartOption>;

  constructor(private api: MockServerService, private http: HttpClient) {
  }

  ngOnInit() {
    this.graphOption = this.http.get('assets/les-miserables.gexf', { responseType: 'text' }).pipe(
      map(xml => {
        const graph = gexf.parse(xml);
        const categories = [];
        for (let i = 0; i < 9; i++) {
          categories[i] = {
            name: '类目' + i
          };
        }
        graph.nodes.forEach(function (node) {
          node.itemStyle = null;
          node.symbolSize = 10;
          node.value = node.symbolSize;
          node.category = node.attributes.modularity_class;
          // Use random x, y
          node.x = node.y = null;
          node.draggable = true;
        });
        return {
          title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
          },
          tooltip: {},
          legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
              return a.name;
            })
          }],
          animation: false,
          series: [
            {
              name: 'Les Miserables',
              type: 'graph',
              layout: 'force',
              data: graph.nodes,
              links: graph.links,
              categories: categories,
              roam: true,
              label: {
                normal: {
                  position: 'right'
                }
              },
              force: {
                repulsion: 100
              }
            }
          ]
        };
      })
    );
  }

  getData() {
    this.loading = true;
    this.api.getData()
      .then(data => {
        this.mergeOption = { series: [{ data }] };
      })
      .catch(e => { /** Error Handler */ })
      .then(() => { this.loading = false; });
  }

  oneDaySelection() {
    console.log(this.initialCount);
  }
}
