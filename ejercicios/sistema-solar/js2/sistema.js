// Time Constants
let year = 365;
let moonOrbitsPerYear = year / 30; // 12 vueltas.
let issOrbistPerYear = year / 15;  // 24 vueltas.

// Distance Constants
let sunToEarth = 90;
let earthToMoon =  45;
let issToEarth = 15;

function to_rads(degrees) { return degrees*(Math.PI/180) };

class SolarSystem {

    static draw(tick) {
        let solarSystem = new Object3D(null, [], 
            [
            // Sistema Tierra
            new Object3D(null, [
                new Operation([[sunToEarth,0,0]], Type.translate),
                new Operation([tick, [0,1,0]], Type.rotate)
            ],
            [
                // Planeta Tierra
                new Object3D(
                    tierra, 
                    [
                        new Operation([tick*(year/10), [0,1,0]], Type.rotate),
                        new Operation([to_rads(-23), [0,0,1]], Type.rotate),
                        new Operation([-tick, [0,1,0]], Type.rotate)
                    ],
                    []),
                // Luna
                new Object3D(
                    luna,
                    [
                        new Operation([[earthToMoon,0,0]], Type.translate),
                        new Operation([tick*moonOrbitsPerYear, [0,1,0]], Type.rotate)
                    ], 
                    [
                        // Apollo
                        new Object3D(
                        apollo,
                        [
                            new Operation([[0,2,0]], Type.translate),
                            new Operation([ to_rads(-45), [0,0,1]], Type.rotate)
                        ],
                        []
                        )
                    ]),
                new Object3D(
                    // Estacion
                    iss,
                    [
                        new Operation([to_rads(90), [0,0,1]], Type.rotate),
                        new Operation([to_rads(-90), [1,0,0]], Type.rotate),
                        new Operation([[0,issToEarth,0]], Type.translate),
                        new Operation([-issOrbistPerYear*tick, [0,0,1]], Type.rotate),
                        new Operation([-tick, [0,1,0]], Type.rotate)
                    ], 
                    [])
            ])
        ]);
        solarSystem.draw();
    }
}
