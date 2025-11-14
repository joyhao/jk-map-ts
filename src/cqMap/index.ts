import jkMap from '@/cqMap/jkMap';
import jkCylinder from '@/cqMap/jkCylinder';

export default class cqMap {
  constructor(selector: string) {
    const map: jkMap = new jkMap(selector);
    new jkCylinder(map);
  }
}
