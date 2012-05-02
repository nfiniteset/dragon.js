describe("Dragon.js", function(){
  beforeEach(function(){
    setFixtures('<div class="square"></div><div class="circle"></div>');
    this.dragon_el = $(".square").dragon();
  });

  it("adds dragon method to jQuery", function(){
    expect(typeof $().dragon).toBe("function");
  });

  it("activates dragon on an element", function(){
    expect(this.dragon_el).toBeDefined();
  });

  describe("with multiple elements", function(){
    beforeEach(function(){
      this.square_el = $('.square').dragon({
        horizontal:true
      });
      this.circle_el = $('.circle').dragon({
        vertical:true
      });
      this.square_id = this.square_el.data('dragon_id');
      this.circle_id = this.circle_el.data('dragon_id');
    });

    it("can configure multiple elements", function(){
      console.log(this.square_el.dragon.settings);
      expect(this.square_el.dragon.settings[this.square_id].horizontal).toBe(true);
      expect(this.square_el.dragon.settings[this.square_id].vertical).toBe(false);
      expect(this.circle_el.dragon.settings[this.circle_id].horizontal).toBe(false);
      expect(this.circle_el.dragon.settings[this.circle_id].vertical).toBe(true);
    });
  });
});
