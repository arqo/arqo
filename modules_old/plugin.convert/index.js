module.exports = function(lunar) {
  lunar.bind('convert.unit', function(value, type, to, from) {
    if(from === null) {
      from = lunar.setting(`convert.units.${type}`);
    }

    if (from == to) {
      return value;
    }

    if(config = lunar.setting(`data.${type}`) {
      if (config[from]) {
        from = config[from].value;
      } else {
        return null;
      }

      if (config[to]) {
        to = config[to].value;
      } else {
        return null;
      }

      return value * (to / from);
    } else {
      return null;
    }
  });
}