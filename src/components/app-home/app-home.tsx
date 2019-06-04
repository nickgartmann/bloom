import { Component, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @State() flowers = []
  @State() zones = [1,2,3,4,5,6,7,8,9,10]

  $keyframes : CSSStyleSheet;

  componentWillLoad() {
    fetch(`/assets/data/flowers.json`).then(async (response) => {
      this.flowers = await response.json();
    })
  }
  componentDidLoad() {
    this.$keyframes = Array.prototype.slice.call(document.styleSheets).find(sheet => sheet.title == "keyframes");
  }

  filterZones(zones) {
    this.zones = zones;
  }

  render() {
    return (
      <div class='app-home'>
        { this.renderFilters() }
        { this.renderFlowers() }
      </div>
    );
  }

  renderFilters() {
    return (
      <div class="filters">
        <app-hardiness-zone-picker onZonesChanged={(event) => this.filterZones(event.detail)} ></app-hardiness-zone-picker>
      </div>
    );
  }

  renderFlowers() {
    this.clearKeyframeSheet();
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Jan</th>
            <th>Feb</th>
            <th>Mar</th>
            <th>Apr</th>
            <th>May</th>
            <th>Jun</th>
            <th>Jul</th>
            <th>Aug</th>
            <th>Sep</th>
            <th>Oct</th>
            <th>Nov</th>
            <th>Dec</th>
          </tr>
        </thead>
        <tbody>
          { this.flowers.filter(this.shouldRenderFlower.bind(this)).map(this.renderFlower.bind(this))  }
        </tbody>
      </table>
    );
  }

  shouldRenderFlower(flower) {
    let shouldRender = true;
    shouldRender = (shouldRender && flower.hardiness_zones.filter((zone) => {
      return this.zones.indexOf(zone) != -1;
    }).length > 0);
    return shouldRender;
  }

  renderFlower(flower) {

    if(this.$keyframes == undefined) return;

    let rules = flower.colors.map((color, index) => {
      return `${index / Math.max((flower.colors.length - 1), 1) * 100 }% { background-color: ${color}}`
    });

    this.$keyframes["insertRule"](`
      @keyframes ${flower.id} {
        ${rules.join("\n")}
      }
    `);

    this.$keyframes["insertRule"](`
      .${flower.id} {
        animation: ${flower.id} 3s infinite alternate ease-in-out;
        background-color: ${flower.colors[0]};
      }
    `);

    return (
      <tr>
        <td>{flower.name}</td>
        { [1,2,3,4,5,6,7,8,9,10,11,12].map((monthIndex) => {
          if(flower.blooms.indexOf(monthIndex) != -1) {
            return (
              <td class={`animated ${flower.id}`}>
              </td>
            )
          } else {
            return <td></td>
          }
        }) }
      </tr>
    )
  }

  clearKeyframeSheet() {
    if(this.$keyframes == undefined) return;
    for(let i = 0; i < this.$keyframes.cssRules.length; ++i) {
      this.$keyframes.deleteRule(i);
    }
  }
}
