// Generated by LiveScript 1.3.1
(function(){
  var ldView;
  ldView = function(opt){
    var root, selector, exclusions, all, prefixRE, this$ = this;
    opt == null && (opt = {});
    this.handler = opt.handler;
    this.scope = opt.scope;
    this.initRender = opt.initRender;
    this.root = root = typeof opt.root === 'string'
      ? ld$.find(document, opt.root, 0)
      : opt.root;
    if (this.root.setAttribute) {
      if (this.scope) {
        this.root.setAttribute('ld-scope', this.scope);
      }
      this.root.setAttribute('ld-root', this.id = "ld-" + Math.random().toString(36).substring(2));
    }
    this.eaches = ld$.find(root, '[ld-each]').map(function(n){
      var p, c, i, ret;
      p = n.parentNode;
      while (p) {
        if (p === document) {
          break;
        } else {
          p = p.parentNode;
        }
      }
      if (!p) {
        return null;
      }
      if (ld$.parent(n.parentNode, '*[ld-each]', document)) {
        return null;
      }
      c = n.parentNode;
      i = Array.from(c.childNodes).indexOf(n);
      ret = {
        container: c,
        idx: i,
        node: n,
        name: n.getAttribute('ld-each'),
        nodes: []
      };
      p = document.createComment(" ld-each=" + ret.name + " ");
      p._data = ret;
      c.insertBefore(p, n);
      ret.proxy = p;
      c.removeChild(n);
      return ret;
    }).filter(function(it){
      return it;
    });
    selector = this.scope ? "[ld^=" + this.scope + "\\$]" : "[ld]";
    exclusions = ld$.find(root, (this.id ? "[ld-root=" + this.id + "] " : "") + ("[ld-scope] " + selector));
    all = ld$.find(root, selector);
    this.nodes = all.filter(function(it){
      return !in$(it, exclusions);
    });
    prefixRE = this.scope ? new RegExp("^" + this.scope + "\\$") : null;
    this.map = {
      nodes: {},
      eaches: {}
    };
    this.nodes.map(function(node){
      var names;
      names = (node.getAttribute('ld') || "").split(' ');
      if (this$.scope) {
        names = names.map(function(it){
          return it.replace(prefixRE, "").trim();
        });
      }
      return names.map(function(it){
        var ref$;
        return ((ref$ = this$.map.nodes)[it] || (ref$[it] = [])).push({
          node: node,
          names: names
        });
      });
    });
    this.eaches.map(function(node){
      var ref$, key$;
      return ((ref$ = this$.map.eaches)[key$ = node.name] || (ref$[key$] = [])).push(node);
    });
    if (this.initRender) {
      this.render();
    }
    return this;
  };
  ldView.prototype = import$(Object.create(Object.prototype), {
    procEach: function(name, data){
      var list, items, nodes, lastidx, ret, ns, this$ = this;
      list = this.handler[name].list();
      items = [];
      nodes = data.nodes.map(function(n){
        if (!in$(n._data, list)) {
          n.parentNode.removeChild(n);
          return n._data = null;
        } else {
          return items.push(n._data);
        }
      }).filter(function(it){
        return it._data;
      });
      lastidx = 0;
      ret = list.map(function(n, i){
        var node;
        if ((lastidx = items.indexOf(n)) >= 0) {
          return nodes[lastidx];
        }
        node = data.node.cloneNode(true);
        node._data = n;
        node.removeAttribute('ld-each');
        data.container.insertBefore(node, nodes[lastidx + 1] || data.proxy);
        return node;
      });
      ns = ret;
      return ns.map(function(it){
        return this$.handler[name].handle({
          node: it,
          name: name,
          data: it._data
        });
      });
    },
    get: function(n){
      return ((this.map.nodes[n] || [])[0] || {}).node;
    },
    getAll: function(n){
      return (this.map.nodes[n] || []).map(function(it){
        return it.node;
      });
    },
    render: function(names){
      var _, k, this$ = this, results$ = [];
      _ = function(n){
        if (this$.map.nodes[n]) {
          this$.map.nodes[n].map(function(d, i){
            if (this$.handler[n]) {
              return this$.handler[n]((d.name = n, d.idx = i, d));
            }
          });
        }
        if (this$.map.eaches[n] && this$.handler[n]) {
          return this$.map.eaches[n].map(function(it){
            return this$.procEach(n, it);
          });
        }
      };
      if (names) {
        return (Array.isArray(names)
          ? names
          : [names]).map(function(it){
          return _(it);
        });
      } else {
        for (k in this.handler) {
          results$.push(_(k));
        }
        return results$;
      }
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = ldView;
  }
  if (typeof window != 'undefined' && window !== null) {
    return window.ldView = ldView;
  }
})();
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
