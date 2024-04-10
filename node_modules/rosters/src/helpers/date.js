const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

Date.prototype.getWOY = function () {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / MILLISECONDS_PER_DAY) + 1) / 7)
};

Date.prototype.getDOY = function () {
  const yearStart = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((this - yearStart) / MILLISECONDS_PER_DAY);
}