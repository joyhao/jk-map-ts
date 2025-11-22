import jkMap from '@/cqMap/jkMap';
import jkCylinder from '@/cqMap/jkCylinder';
import jkLine from './jkLine';
import jkWater from './jkWater';

export default class cqMap {
  constructor(selector: string) {
    const map: jkMap = new jkMap(selector);
    new jkCylinder(map);
    new jkLine(map);
    new jkWater(map);
  }
}
