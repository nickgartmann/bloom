import { Component, State, Event, EventEmitter } from '@stencil/core';

const ZONES = [1,2,3,4,5,6,7,8,9,10]

@Component({
  tag: 'app-hardiness-zone-picker',
  styleUrl: 'app-hardiness-zone-picker.css'
})
export class AppHardinessZonePicker {

  @State() selectedZones:Array<number> = ZONES.slice(0);
  @Event() zonesChanged : EventEmitter;

  isZoneSelected(id) {
    return this.selectedZones.indexOf(id) !== -1;
  }

  selectZone(id) {
    this.selectedZones = [
      id,
      ...this.selectedZones
    ]
    this.zonesChanged.emit(this.selectedZones);
  }

  deselectZone(id) {
    this.selectedZones = this.selectedZones.filter(z => z !== id)
    this.zonesChanged.emit(this.selectedZones);
  }

  render() {
    return (
      <ol>
        { ZONES.map(this.renderZone.bind(this)) }
      </ol>
    );
  }

  renderZone(zone) { 
    if(this.isZoneSelected(zone)) {
      return (<li class="selected" onClick={() => this.deselectZone(zone)}>{zone}</li>);
    } else {
      return (<li onClick={() => this.selectZone(zone)}>{zone}</li>);
    }
  }


}

