import jkMap from '@/cqMap/jkMap';
import jkCylinder from '@/cqMap/jkCylinder';
import jkLine from './jkLine';
import jkWater from './jkWater';
import jkBorder from './jkBorder';
import jkPathAnimation from './jkPathAnimation';

export default class cqMap {
  constructor(selector: string) {
    const map: jkMap = new jkMap(selector);
    //  new jkBorder(map);
    new jkCylinder(map);
    new jkLine(map);
    new jkWater(map);
    new jkPathAnimation(map);
  }
}
