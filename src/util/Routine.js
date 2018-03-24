
class Routine {

  static isString(value) {
    return typeof value === 'string';
  }

  static isArray(value) {
    return Array.isArray(value);
  };

  static isObject(value) {
    return value !== null && typeof value === 'object';
  }

  static isFunction(value) {
    return typeof value === 'function';
  }

  static isDefined(value) {
    return typeof value !== 'undefined';
  }

  static isElement(value) {
    return !!(value && (value.nodeName || (value.prop && value.attr && value.find)));
  }

  /**
 * Get all DOM element up the tree that contain a class, ID, or data attribute
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Array} Null if no match
 */
 static getParents(elem, selector) {
    var parents = [];
    var firstChar;
    if ( selector ) {
        firstChar = selector.charAt(0);
    }

    // Get matches
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( selector ) {

            // If selector is a class
            if ( firstChar === '.' ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    parents.push( elem );
                }
            }

            // If selector is an ID
            if ( firstChar === '#' ) {
                if ( elem.id === selector.substr(1) ) {
                    parents.push( elem );
                }
            }

            // If selector is a data attribute
            if ( firstChar === '[' ) {
                if ( elem.hasAttribute( selector.substr(1, selector.length - 1) ) ) {
                    parents.push( elem );
                }
            }

            // If selector is a tag
            if ( elem.tagName.toLowerCase() === selector ) {
                parents.push( elem );
            }

        } else {
            parents.push( elem );
        }

    }

    return parents;
  }

  /**
 * Get the closest matching element up the DOM tree.
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
 * @return {Boolean|Element}  Returns null if not match found
 */
 static getClosest(elem, selector) {

    // Variables
    var firstChar = selector.charAt(0);
    var supports = 'classList' in document.documentElement;
    var attribute, value;

    // If selector is a data attribute, split attribute from value
    if ( firstChar === '[' ) {
        selector = selector.substr( 1, selector.length - 2 );
        attribute = selector.split( '=' );

        if ( attribute.length > 1 ) {
            value = true;
            attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
        }
    }

    // Get closest match
    for ( ; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode ) {

        // If selector is a class
        if ( firstChar === '.' ) {
            if ( supports ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    return elem;
                }
            } else {
                if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
                    return elem;
                }
            }
        }

        // If selector is an ID
        if ( firstChar === '#' ) {
            if ( elem.id === selector.substr(1) ) {
                return elem;
            }
        }

        // If selector is a data attribute
        if ( firstChar === '[' ) {
            if ( elem.hasAttribute( attribute[0] ) ) {
                if ( value ) {
                    if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
                        return elem;
                    }
                } else {
                    return elem;
                }
            }
        }

        // If selector is a tag
        if ( elem.tagName.toLowerCase() === selector ) {
            return elem;
        }

    }

    return null;

  }

  static toggleClass(element, className1, className2) {
    if (element.classList.contains(className1)) {
      element.classList.remove(className1);
      element.classList.add(className2);
    } else {
      element.classList.remove(className2);
      element.classList.add(className1);
    }
  }

}

export default Routine;
