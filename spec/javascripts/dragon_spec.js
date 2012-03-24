describe("Dragon.js", function(){
  beforeEach(function(){
    setFixtures('<div class="square"></div><div class="circle"></div>');
    console.dir($(".square"))
    this.dragon_el = $(".square").dragon();
  });
  
  it("adds dragon method to jQuery", function(){
    expect(typeof $().dragon).toBe("function");
  });
  
  it("activates dragon on an element", function(){
    expect(this.dragon_el).toBeDefined();
  });
});