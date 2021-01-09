const _createClass = (function() {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be null or a function, not ${typeof superClass}`
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
const immutable = require('immutable');
const invariant = require('fbjs/lib/invariant');

let List = immutable.List,
  Set = immutable.Set;
function isRouteEmpty(route) {
  return route === undefined || route === null || route === '' || false;
}
let _nextID = 0;
const RouteNode = function RouteNode(route) {
  _classCallCheck(this, RouteNode);
  this.key = String(_nextID++);
  this.value = route;
};
const StackDiffRecord = immutable.Record({ key: null, route: null, index: null });
const RouteStack = (function() {
  function RouteStack(index, routeNodes) {
    _classCallCheck(this, RouteStack);
    invariant(routeNodes.size > 0, 'size must not be empty');
    invariant(index > -1 && index <= routeNodes.size - 1, 'index out of bound');
    this._routeNodes = routeNodes;
    this._index = index;
  }
  _createClass(RouteStack, [
    {
      key: 'toArray',
      value: function toArray() {
        const result = [];
        let ii = 0;
        const nodes = this._routeNodes;
        while (ii < nodes.size) {
          result.push(nodes.get(ii).value);
          ii++;
        }
        return result;
      },
    },
    {
      key: 'get',
      value: function get(index) {
        if (index < 0 || index > this._routeNodes.size - 1) {
          return null;
        }
        return this._routeNodes.get(index).value;
      },
    },
    {
      key: 'keyOf',
      value: function keyOf(route) {
        if (isRouteEmpty(route)) {
          return null;
        }
        const index = this.indexOf(route);
        return index > -1 ? this._routeNodes.get(index).key : null;
      },
    },
    {
      key: 'indexOf',
      value: function indexOf(route) {
        if (isRouteEmpty(route)) {
          return -1;
        }
        const finder = function finder(node) {
          return node.value === route;
        };
        return this._routeNodes.findIndex(finder, this);
      },
    },
    {
      key: 'slice',
      value: function slice(begin, end) {
        const routeNodes = this._routeNodes.slice(begin, end);
        const index = Math.min(this._index, routeNodes.size - 1);
        return this._update(index, routeNodes);
      },
    },
    {
      key: 'push',
      value: function push(route) {
        const _this = this;
        invariant(!isRouteEmpty(route), 'Must supply route to push');
        invariant(this._routeNodes.indexOf(route) === -1, 'route must be unique');
        const routeNodes = this._routeNodes.withMutations(function(list) {
          list.slice(0, _this._index + 1).push(new RouteNode(route));
        });
        return this._update(routeNodes.size - 1, routeNodes);
      },
    },
    {
      key: 'pop',
      value: function pop() {
        invariant(this._routeNodes.size > 1, 'should not pop routeNodes stack to empty');
        const routeNodes = this._routeNodes.slice(0, this._index);
        return this._update(routeNodes.size - 1, routeNodes);
      },
    },
    {
      key: 'jumpToIndex',
      value: function jumpToIndex(index) {
        invariant(index > -1 && index < this._routeNodes.size, 'index out of bound');
        return this._update(index, this._routeNodes);
      },
    },
    {
      key: 'replaceAtIndex',
      value: function replaceAtIndex(index, route) {
        invariant(!isRouteEmpty(route), 'Must supply route to replace');
        if (this.get(index) === route) {
          return this;
        }
        invariant(this.indexOf(route) === -1, 'route must be unique');
        if (index < 0) {
          index += this._routeNodes.size;
        }
        invariant(index > -1 && index < this._routeNodes.size, 'index out of bound');
        const routeNodes = this._routeNodes.set(index, new RouteNode(route));
        return this._update(index, routeNodes);
      },
    },
    {
      key: 'forEach',
      value: function forEach(callback, context) {
        let ii = 0;
        const nodes = this._routeNodes;
        while (ii < nodes.size) {
          const node = nodes.get(ii);
          callback.call(context, node.value, ii, node.key);
          ii++;
        }
      },
    },
    {
      key: 'mapToArray',
      value: function mapToArray(callback, context) {
        const result = [];
        this.forEach(function(route, index, key) {
          result.push(callback.call(context, route, index, key));
        });
        return result;
      },
    },
    {
      key: 'subtract',
      value: function subtract(stack) {
        const items = [];
        this._routeNodes.forEach(function(node, index) {
          if (!stack._routeNodes.contains(node)) {
            items.push(new StackDiffRecord({ route: node.value, index, key: node.key }));
          }
        });
        return new Set(items);
      },
    },
    {
      key: '_update',
      value: function _update(index, routeNodes) {
        if (this._index === index && this._routeNodes === routeNodes) {
          return this;
        }
        return new RouteStack(index, routeNodes);
      },
    },
    {
      key: 'size',
      get: function get() {
        return this._routeNodes.size;
      },
    },
    {
      key: 'index',
      get: function get() {
        return this._index;
      },
    },
  ]);
  return RouteStack;
})();
const NavigationRouteStack = (function(_RouteStack) {
  _inherits(NavigationRouteStack, _RouteStack);
  function NavigationRouteStack(index, routeNodes) {
    _classCallCheck(this, NavigationRouteStack);
    const nodes = routeNodes.map(function(route) {
      invariant(!isRouteEmpty(route), 'route must not be mepty');
      return new RouteNode(route);
    });
    return _possibleConstructorReturn(
      this,
      (NavigationRouteStack.__proto__ || Object.getPrototypeOf(NavigationRouteStack)).call(
        this,
        index,
        new List(nodes)
      )
    );
  }
  return NavigationRouteStack;
})(RouteStack);
module.exports = NavigationRouteStack;
