/**
* Removes all children from a DOM Node.
* @param {Node} parent Parent from which to remove all children.
*/
export default function removeAllChildren(parent) {
 while (parent.hasChildNodes()) {
   parent.removeChild(parent.firstChild);
 }
}
