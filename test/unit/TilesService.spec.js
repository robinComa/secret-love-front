describe("Tiles Service Unit Tests", function() {

    beforeEach(function() {
        module('app');
    });

    var VideoTiles;
    beforeEach(inject(function (_VideoTiles_) {
        VideoTiles = _VideoTiles_;
    }));

    it('should be defined', function () {
        expect(VideoTiles).toBeDefined();
    });

    it('should find the bigger video', function () {
        var model = VideoTiles.buildGridModel([
            {"likes":4},
            {"likes":3},
            {"likes":2},
            {"likes":1}
        ]);
        expect(model[0].size.row).toBe(1);
        expect(model[0].size.col).toBe(2);
    });

    afterEach(function() {

    });

});