// Horse-shaped dot coordinates with real location data
// These coordinates form the shape of a horse when connected
// Centered around Hanoi, Vietnam

const LOCATIONS = [
    // Head and ears (points 1-8)
    {
        id: 1,
        lat: 21.0365,
        lng: 105.8345,
        name: "Hoàn Kiếm Lake",
        address: "Hoàn Kiếm District, Hanoi",
        story: "Legend speaks of the Golden Turtle God who reclaimed the sacred sword here. In ancient times, horses would drink from these waters before royal processions."
    },
    {
        id: 2,
        lat: 21.0395,
        lng: 105.8380,
        name: "Ngọc Sơn Temple",
        address: "Đinh Tiên Hoàng, Hoàn Kiếm, Hanoi",
        story: "The temple where warriors blessed their horses before battle, seeking protection from the spirits of the lake."
    },
    {
        id: 3,
        lat: 21.0425,
        lng: 105.8360,
        name: "Đồng Xuân Market",
        address: "Đồng Xuân, Hoàn Kiếm, Hanoi",
        story: "The historic market where horses once carried silk and spices, their hooves echoing through narrow lanes at dawn."
    },
    {
        id: 4,
        lat: 21.0410,
        lng: 105.8310,
        name: "Old Quarter Gate",
        address: "Hàng Đào Street, Hoàn Kiếm, Hanoi",
        story: "Ancient gates where cavalry entered the citadel, their bronze bells announcing victory or warning of danger."
    },
    {
        id: 5,
        lat: 21.0385,
        lng: 105.8270,
        name: "St. Joseph's Cathedral",
        address: "40 Nhà Chung, Hoàn Kiếm, Hanoi",
        story: "Built on the site where French cavalry once stationed their horses during colonial times."
    },
    {
        id: 6,
        lat: 21.0360,
        lng: 105.8300,
        name: "Tràng Tiền Plaza",
        address: "24 Hai Bà Trưng, Hoàn Kiếm, Hanoi",
        story: "Where elegant horse-drawn carriages once delivered aristocrats to grand colonial buildings."
    },
    {
        id: 7,
        lat: 21.0330,
        lng: 105.8320,
        name: "Opera House",
        address: "1 Tràng Tiền, Hoàn Kiếm, Hanoi",
        story: "The magnificent opera house where horses waited in ornate carriages, their riders draped in silk and pearls."
    },
    {
        id: 8,
        lat: 21.0300,
        lng: 105.8350,
        name: "Thống Nhất Park",
        address: "Đinh Tiên Hoàng, Hoàn Kiếm, Hanoi",
        story: "A peaceful park where old war horses grazed, remembering the battles they survived along the Reunification path."
    },
    // Neck (points 9-12)
    {
        id: 9,
        lat: 21.0275,
        lng: 105.8400,
        name: "Hỏa Lò Prison",
        address: "1 Hỏa Lò, Hoàn Kiếm, Hanoi",
        story: "Even in the darkest times, prisoners could hear horses passing outside, a reminder of freedom just beyond the walls."
    },
    {
        id: 10,
        lat: 21.0245,
        lng: 105.8450,
        name: "Lenin Park",
        address: "Điện Biên Phủ, Ba Đình, Hanoi",
        story: "Soviet horses were gifted here during friendship exchanges, their strength symbolizing solidarity between nations."
    },
    {
        id: 11,
        lat: 21.0210,
        lng: 105.8500,
        name: "Temple of Literature",
        address: "58 Quốc Tử Giám, Đống Đa, Hanoi",
        story: "Vietnam's first university, where scholars arrived on horseback, their steeds waiting patiently under ancient trees."
    },
    {
        id: 12,
        lat: 21.0175,
        lng: 105.8550,
        name: "Fine Arts Museum",
        address: "66 Nguyễn Thái Học, Ba Đình, Hanoi",
        story: "Paintings here capture Vietnamese cavalry charging through mountains, defending the nation with unwavering courage."
    },
    // Body (points 13-20)
    {
        id: 13,
        lat: 21.0140,
        lng: 105.8600,
        name: "One Pillar Pagoda",
        address: "Chùa Một Cột, Ba Đình, Hanoi",
        story: "Built in 1049, when Emperor Lý Thái Tông rode his white horse to this sacred site following a prophetic dream."
    },
    {
        id: 14,
        lat: 21.0110,
        lng: 105.8680,
        name: "Ho Chi Minh Mausoleum",
        address: "2 Hùng Vương, Ba Đình, Hanoi",
        story: "Where Uncle Ho declared independence, as cavalry units stood at attention, their horses silent witnesses to history."
    },
    {
        id: 15,
        lat: 21.0085,
        lng: 105.8750,
        name: "Presidential Palace",
        address: "1 Hoàng Hoa Thám, Ba Đình, Hanoi",
        story: "The colonial palace where Governor-General's horses were groomed in gold-trimmed stables, symbols of imperial power."
    },
    {
        id: 16,
        lat: 21.0060,
        lng: 105.8820,
        name: "Botanical Garden",
        address: "Quán Sứ, Ba Đình, Hanoi",
        story: "Rare medicinal herbs grow here, once harvested to heal wounded cavalry horses during resistance wars."
    },
    {
        id: 17,
        lat: 21.0035,
        lng: 105.8890,
        name: "Trúc Bạch Lake",
        address: "Trúc Bạch, Ba Đình, Hanoi",
        story: "The white bamboo lake where royal horses cooled themselves after training, their reflections dancing on still waters."
    },
    {
        id: 18,
        lat: 21.0010,
        lng: 105.8960,
        name: "Quán Thánh Temple",
        address: "Quán Thánh, Ba Đình, Hanoi",
        story: "Temple to the guardian deity of the North, where warriors prayed for their horses' protection before northern campaigns."
    },
    {
        id: 19,
        lat: 21.0040,
        lng: 105.9030,
        name: "West Lake Pagoda",
        address: "Tây Hồ, Hanoi",
        story: "The oldest pagoda in Hanoi, overlooking the lake where horses once swam during the scorching summer months."
    },
    {
        id: 20,
        lat: 21.0070,
        lng: 105.9100,
        name: "Trấn Quốc Pagoda",
        address: "Thanh Niên, Tây Hồ, Hanoi",
        story: "Built 1,500 years ago, this pagoda watched horses and armies come and go, remaining eternal like the lake itself."
    },
    // Front legs (points 21-26)
    {
        id: 21,
        lat: 21.0100,
        lng: 105.9150,
        name: "Flower Gardens",
        address: "Yên Phụ, Tây Hồ, Hanoi",
        story: "Gardens where flower merchants arrived by horse-cart at dawn, filling the air with jasmine and lotus blooms."
    },
    {
        id: 22,
        lat: 21.0080,
        lng: 105.9200,
        name: "Yên Phụ Village",
        address: "Yên Phụ, Tây Hồ, Hanoi",
        story: "Fishing village where horses helped haul nets full of West Lake fish, working in harmony with the water buffalo."
    },
    {
        id: 23,
        lat: 21.0050,
        lng: 105.9250,
        name: "Xuan La Village",
        address: "Xuân La, Tây Hồ, Hanoi",
        story: "Village famous for its horse trainers, who bred and raised the finest cavalry mounts in the Red River Delta."
    },
    {
        id: 24,
        lat: 21.0110,
        lng: 105.8650,
        name: "Military Museum",
        address: "28A Điện Biên Phủ, Ba Đình, Hanoi",
        story: "Chronicles of cavalry charges at Điện Biên Phủ, where horses carried ammunition through impossible mountain passes."
    },
    {
        id: 25,
        lat: 21.0080,
        lng: 105.8600,
        name: "Cửa Bắc Gate",
        address: "Điện Biên Phủ, Ba Đình, Hanoi",
        story: "The North Gate of Thăng Long Citadel, where Lý dynasty cavalry rode out to defend against northern invaders."
    },
    {
        id: 26,
        lat: 21.0050,
        lng: 105.8550,
        name: "Flag Tower",
        address: "Điện Biên Phủ, Ba Đình, Hanoi",
        story: "The 33-meter tower that guided cavalry home, its flag visible from miles across the Red River plain."
    },
    // Back legs (points 27-32)
    {
        id: 27,
        lat: 21.0020,
        lng: 105.8500,
        name: "Imperial Citadel",
        address: "Hoàng Diệu, Ba Đình, Hanoi",
        story: "UNESCO heritage site where emperors kept royal stables, their horses adorned with silk and golden saddles."
    },
    {
        id: 28,
        lat: 20.9990,
        lng: 105.8450,
        name: "Ancient Citadel Ruins",
        address: "Hoàng Diệu, Ba Đình, Hanoi",
        story: "Archaeological excavations revealed horseshoes from the Lý dynasty, proof of cavalry stationed here 900 years ago."
    },
    {
        id: 29,
        lat: 20.9960,
        lng: 105.8400,
        name: "Army Museum",
        address: "28A Điện Biên Phủ, Ba Đình, Hanoi",
        story: "Exhibits showcase the vital role horses played in Vietnam's wars of independence against colonial powers."
    },
    {
        id: 30,
        lat: 21.0020,
        lng: 105.9280,
        name: "Nhat Tan Bridge",
        address: "Nguyễn Văn Cừ, Long Biên, Hanoi",
        story: "Modern bridge where horses once forded the Red River, carrying rice and tea to distant markets."
    },
    {
        id: 31,
        lat: 20.9980,
        lng: 105.9320,
        name: "Flower Village",
        address: "Nhật Tân, Tây Hồ, Hanoi",
        story: "Famous for peach blossoms, where horses pulled carts laden with flowers for Tết celebrations each spring."
    },
    {
        id: 32,
        lat: 20.9950,
        lng: 105.9360,
        name: "Red River Dyke",
        address: "Âu Cơ, Tây Hồ, Hanoi",
        story: "The ancient dyke where horses labored to build flood defenses, their hooves pounding earth into protective walls."
    },
    // Tail (points 33-36)
    {
        id: 33,
        lat: 20.9990,
        lng: 105.8350,
        name: "B-52 Victory Museum",
        address: "157 Đội Cấn, Ba Đình, Hanoi",
        story: "A reminder that even in modern warfare, some villages still used horses to transport supplies through jungle trails."
    },
    {
        id: 34,
        lat: 20.9960,
        lng: 105.8300,
        name: "Giảng Võ Lake",
        address: "Giảng Võ, Ba Đình, Hanoi",
        story: "Training ground where young soldiers learned to ride, their horses splashing through shallow waters."
    },
    {
        id: 35,
        lat: 20.9930,
        lng: 105.8250,
        name: "Kim Mã Bus Station",
        address: "Nguyễn Thái Học, Ba Đình, Hanoi",
        story: "Before buses, this was a horse station where travelers rested their steeds before journeying to the mountains."
    },
    {
        id: 36,
        lat: 20.9900,
        lng: 105.8200,
        name: "Nghĩa Tân Village",
        address: "Nghĩa Tân, Cầu Giấy, Hanoi",
        story: "The final rest, where the spirit of Vietnamese horses runs free through rice paddies, their legacy eternal in the heart of the nation."
    }
];
