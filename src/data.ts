import { Product, BlogPost, MarketingCampaign } from "./types";

export const LUXURY_PRODUCTS: Product[] = [
  {
    id: "de-oud-mystique",
    name: "Mystical Oud",
    brand: "D & E Essentials",
    description: "An opulent, dark, and enigmatic fragrance that blends rare Cambodian agarwood with velvety Damascus rose. Warm amber and creamy Mysore sandalwood form a luxurious, smoky base that lingers in the air with majestic presence.",
    price: 180,
    discountPrice: 155,
    size: ["50ml", "100ml"],
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-OUD-MYS-100",
    barcode: "602345091223",
    stock: 24,
    fragranceFamily: "Oriental",
    occasion: ["Evening", "Date Night", "Formal Events", "Winter"],
    notes: {
      top: ["Saffron", "Incense", "Cardamom"],
      middle: ["Damascus Rose", "Agarwood (Oud)", "Patchouli"],
      base: ["Sandalwood", "Amber", "Leather", "Vanilla"]
    },
    ingredients: ["Alcohol Denat.", "Fragrance (Parfum)", "Aqua/Water/Eau", "Linalool", "Limonene", "Coumarin", "Eugenol", "Citronellol"],
    reviews: [
      { id: "r1", userName: "Amina K.", rating: 5, comment: "Absolutely divine. The oud is smooth and not overpowering, balanced beautifully by the rose. It stays on my skin for over 12 hours!", date: "2026-05-12", verified: true },
      { id: "r2", userName: "Marcus O.", rating: 5, comment: "The ultimate signature scent. Everyone asks me what I'm wearing. Simply stunning packaging too.", date: "2026-06-01", verified: true }
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: "de-rouge-seduction",
    name: "Red Seduction",
    brand: "D & E Essentials",
    description: "Intoxicatingly sweet and boldly seductive. Red Seduction features a rich harmony of dark red berries, crystallized praline, and warm vanilla orchid, wrapped in a deeply mysterious amberwood cloak.",
    price: 145,
    size: ["50ml", "100ml"],
    gender: "Women",
    rating: 4.8,
    reviewsCount: 98,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-ROU-SED-100",
    barcode: "602345091224",
    stock: 18,
    fragranceFamily: "Gourmand",
    occasion: ["Date Night", "Evening", "Autumn", "Winter"],
    notes: {
      top: ["Red Berries", "Saffron", "Bitter Almond"],
      middle: ["Jasmine Sambac", "Crystallized Praline", "Vanilla Orchid"],
      base: ["Amberwood", "Oakmoss", "White Cedar", "Musk"]
    },
    ingredients: ["Alcohol Denat.", "Fragrance (Parfum)", "Aqua", "Benzyl Salicylate", "Linalool", "Ethylhexyl Methoxycinnamate", "Limonene"],
    reviews: [
      { id: "r3", userName: "Sophia M.", rating: 5, comment: "Sweet but sophisticated. It has this incredible caramelized amber vibe that smells extremely high-end. Love it!", date: "2026-06-14", verified: true },
      { id: "r4", userName: "Chloe T.", rating: 4, comment: "Delicious scent! It smells like warm spun sugar and berries. Gets lots of compliments.", date: "2026-06-20", verified: false }
    ],
    featured: true,
    newArrival: true
  },
  {
    id: "de-santal-imperial",
    name: "Imperial Sandalwood",
    brand: "D & E Essentials",
    description: "An elegant, cream-textured masterpiece highlighting rare Mysore sandalwood. Opening with dry, exotic spices and crisp green papyrus, it dries down to a rich, soothing woody warmth that exudes effortless confidence.",
    price: 160,
    discountPrice: 140,
    size: ["50ml", "100ml"],
    gender: "Unisex",
    rating: 4.9,
    reviewsCount: 84,
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-SAN-IMP-100",
    barcode: "602345091225",
    stock: 35,
    fragranceFamily: "Woody",
    occasion: ["Daily Wear", "Office", "Spring", "All Season"],
    notes: {
      top: ["Cardamom", "Violet Leaf", "Papyrus"],
      middle: ["Leather", "Iris", "Virginia Cedarwood"],
      base: ["Sandalwood", "Amber", "Warm Musk"]
    },
    ingredients: ["Alcohol Denat.", "Fragrance", "Water", "Farnesol", "Geraniol", "Limonene", "Linalool", "Citral"],
    reviews: [
      { id: "r5", userName: "David L.", rating: 5, comment: "The perfect wood fragrance. Crisp, clean, but incredibly deep and comforting. Incredible sandalwood notes.", date: "2026-05-22", verified: true }
    ],
    bestSeller: true
  },
  {
    id: "de-fleur-de-minuit",
    name: "Midnight Flower",
    brand: "D & E Essentials",
    description: "Capturing the magic of night-blooming blossoms. A velvety, dark floral fragrance composed of wild black orchids, rich jasmine petals, and sweet patchouli, grounded in seductive cashmere wood and black musk.",
    price: 135,
    size: ["50ml", "100ml"],
    gender: "Women",
    rating: 4.7,
    reviewsCount: 62,
    images: [
      "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-FLE-MIN-100",
    barcode: "602345091226",
    stock: 15,
    fragranceFamily: "Floral",
    occasion: ["Evening", "Date Night", "Spring", "Summer Nights"],
    notes: {
      top: ["Blackberry", "Pink Pepper", "Orchid"],
      middle: ["Jasmine Sambac", "Ylang-Ylang", "Damask Rose"],
      base: ["Patchouli", "Cashmere Wood", "Black Musk", "Vanilla"]
    },
    ingredients: ["Alcohol Denat.", "Fragrance", "Aqua", "Citronellol", "Limonene", "Linalool", "Geraniol", "Benzyl Benzoate"],
    reviews: [
      { id: "r6", userName: "Elena R.", rating: 5, comment: "Smells like a deep, expensive night garden. Extremely elegant and long-lasting.", date: "2026-06-18", verified: true }
    ],
    newArrival: true
  },
  {
    id: "de-elixir-dor",
    name: "Golden Elixir",
    brand: "D & E Essentials",
    description: "A bright, golden explosion of fresh citrus and intense spice. Crisp Calabrian bergamot, golden grapefruit, and dry Sichuan pepper lead into a powerful heart of aromatic vetiver and clean mineral amber.",
    price: 150,
    size: ["50ml", "100ml"],
    gender: "Men",
    rating: 4.8,
    reviewsCount: 142,
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-ELI-DOR-100",
    barcode: "602345091227",
    stock: 40,
    fragranceFamily: "Citrus",
    occasion: ["Daily Wear", "Office", "Summer", "Spring", "Gym"],
    notes: {
      top: ["Calabrian Bergamot", "Golden Grapefruit", "Sichuan Pepper"],
      middle: ["Lavender", "Geranium", "Aromatic Vetiver"],
      base: ["Ambrosia", "Patchouli", "Cedarwood", "Oakmoss"]
    },
    ingredients: ["Alcohol Denat.", "Parfum", "Aqua", "Limonene", "Linalool", "Citral", "Butyl Methoxydibenzoylmethane"],
    reviews: [
      { id: "r7", userName: "Brian K.", rating: 5, comment: "Incredibly fresh and masculine. Perfect for the daytime, lasts through the entire workday easily.", date: "2026-05-30", verified: true }
    ],
    bestSeller: true
  },
  {
    id: "de-noir-absolu",
    name: "Absolute Black",
    brand: "D & E Essentials",
    description: "A powerful, commanding scent designed for the modern gentleman. Absolute Black fuses rugged Tuscan leather with roasted coffee beans and dry tobacco leaf, dried down on a luxurious, rich dark chocolate base.",
    price: 170,
    discountPrice: 150,
    size: ["50ml", "100ml"],
    gender: "Men",
    rating: 4.9,
    reviewsCount: 110,
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-NOI-ABS-100",
    barcode: "602345091228",
    stock: 12,
    fragranceFamily: "Woody",
    occasion: ["Evening", "Formal Events", "Winter", "Business Meetings"],
    notes: {
      top: ["Black Pepper", "Bergamot", "Cardamom"],
      middle: ["Tuscan Leather", "Roasted Coffee Beans", "Tobacco Leaf"],
      base: ["Dark Chocolate", "Cedarwood", "Vetyver", "Sandalwood"]
    },
    ingredients: ["Alcohol Denat.", "Parfum", "Aqua", "Coumarin", "Limonene", "Linalool", "Eugenol", "Isoeugenol"],
    reviews: [
      { id: "r8", userName: "Evans J.", rating: 5, comment: "Smoky, rich, and dark. The coffee and leather combination is masterful. This is high luxury in a bottle.", date: "2026-06-25", verified: true }
    ],
    featured: true
  },
  {
    id: "de-celeste-fresh",
    name: "Celestial Fresh",
    brand: "D & E Essentials",
    description: "A refreshing, celestial journey along sun-drenched coastlines. Opening with sparkling sea salt and zesty key lime, it melts into a comforting breeze of clean white tea and crystalline cloud-musk.",
    price: 125,
    size: ["50ml", "100ml"],
    gender: "Unisex",
    rating: 4.6,
    reviewsCount: 74,
    images: [
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-CEL-FRE-100",
    barcode: "602345091229",
    stock: 5,
    fragranceFamily: "Fresh",
    occasion: ["Summer", "Daily Wear", "Beach Days", "Spring", "Gym"],
    notes: {
      top: ["Sea Salt", "Zesty Lime", "Bergamot"],
      middle: ["White Tea", "Jasmine Petals", "Sage"],
      base: ["Crystalline Musk", "Ambrette Seed", "Cedarwood"]
    },
    ingredients: ["Alcohol Denat.", "Fragrance", "Water", "Limonene", "Linalool", "Geraniol", "Citral"],
    reviews: [
      { id: "r9", userName: "Sarah O.", rating: 4, comment: "Super fresh, smells exactly like an ocean breeze! Great for hot summer days, though I wish it lasted slightly longer on skin.", date: "2026-06-05", verified: true }
    ]
  },
  {
    id: "de-rose-satin",
    name: "Rose Satin",
    brand: "D & E Essentials",
    description: "A silky, powdery romantic kiss. Rose Satin brings together fresh-cut Turkish rose petals, powdered confectioners' sugar, and blooming pink peonies, all cradled on a bed of silky vanilla orchid.",
    price: 130,
    discountPrice: 115,
    size: ["50ml", "100ml"],
    gender: "Women",
    rating: 4.8,
    reviewsCount: 51,
    images: [
      "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600"
    ],
    sku: "DE-ROS-SAT-100",
    barcode: "602345091230",
    stock: 22,
    fragranceFamily: "Floral",
    occasion: ["Spring", "Daily Wear", "Brunch", "Wedding Guest"],
    notes: {
      top: ["Turkish Rose", "Lychee", "Bergamot"],
      middle: ["Pink Peony", "Powdered Sugar", "Lily of the Valley"],
      base: ["Vanilla Orchid", "White Musk", "Soft Vetiver"]
    },
    ingredients: ["Alcohol Denat.", "Parfum", "Aqua", "Citronellol", "Limonene", "Linalool", "Geraniol", "Eugenol"],
    reviews: [
      { id: "r10", userName: "Mercy A.", rating: 5, comment: "So soft and elegant. Smells like expensive rose powder and sweet lychees. Stunning bottle!", date: "2026-06-11", verified: true }
    ],
    newArrival: true
  },
  {
    id: "zara-deep-garden",
    name: "ZARA Deep Garden Eau de Parfum",
    brand: "ZARA",
    description: "Soft, elegant, and effortlessly feminine. ✨ Experience the delicate blend of creamy white florals wrapped in juicy fruity freshness, soft tuberose depth, and a clean aquatic-green touch. The result is a graceful, feminine fragrance that feels fresh, light, and beautifully comforting all day long. 💖 Perfect for everyday wear, brunch dates, the office, and special occasions.",
    price: 7300,
    size: ["100ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-DEEP-GAR-100",
    barcode: "ZARA1",
    stock: 7,
    fragranceFamily: "Floral",
    occasion: ["Daily Wear", "Brunch", "Office", "Special Occasions"],
    notes: {
      top: ["Pear", "White Florals"],
      middle: ["Tuberose"],
      base: ["Tonka Bean"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-lisboa",
    name: "ZARA Lisboa Eau de Toilette",
    brand: "ZARA",
    description: "Fresh, clean, and effortlessly modern. ✨ Discover Lisboa: a refreshing aquatic fragrance blended with bergamot, marine accord, lavender, and cedarwood. The result is a cool, crisp scent that feels clean, elegant, and timeless. 🩵Perfect for daily wear, office days, and warm-weather outings.",
    price: 5000,
    size: ["100ml"],
    gender: "Men",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-LIS-100",
    barcode: "ZARA2",
    stock: 7,
    fragranceFamily: "Fresh",
    occasion: ["Daily Wear", "Office", "Summer"],
    notes: {
      top: ["Bergamot", "Marine Accord"],
      middle: ["Lavender"],
      base: ["Cedarwood"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-bogoss-vibrant-leather",
    name: "ZARA Bogoss Vibrant Leather Summer Eau de Parfum",
    brand: "ZARA",
    description: "Fresh, vibrant, and effortlessly masculine. ✨ Experience the refreshing blend of ozonic and aquatic notes, layered with juicy fruity accords and tropical freshness, before settling into warm amber and subtle leather. The result is a clean, energetic fragrance that captures the feeling of summer in every spray. 🩵 Perfect for everyday wear, the office, vacations, gym sessions, and warm summer days.",
    price: 7500,
    size: ["100ml"],
    gender: "Men",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-BOG-VIB-100",
    barcode: "ZARA3",
    stock: 7,
    fragranceFamily: "Fresh",
    occasion: ["Daily Wear", "Office", "Summer", "Gym"],
    notes: {
      top: ["Ozonic Notes", "Pineapple"],
      middle: ["Aquatic Notes"],
      base: ["Amber", "Leather"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-tuberose",
    name: "ZARA Tuberose Eau de Parfum",
    brand: "ZARA",
    description: "Soft, radiant, and effortlessly feminine. ✨ Experience the bright freshness of citrus, blended with creamy tuberose, soft vanilla, and powdery musk. The result is a delicate floral fragrance that's elegant, comforting, and beautifully long-lasting. 💖 Perfect for everyday wear, brunch dates, the office, and romantic evenings.",
    price: 6100,
    size: ["100ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-TUB-100",
    barcode: "ZARA4",
    stock: 7,
    fragranceFamily: "Floral",
    occasion: ["Daily Wear", "Brunch", "Date Night"],
    notes: {
      top: ["Citrus"],
      middle: ["Tuberose"],
      base: ["Vanilla", "Musk"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-london-savile-row",
    name: "ZARA London Savile Row Mayfair Eau de Toilette",
    brand: "ZARA",
    description: "Refined, sophisticated, and effortlessly timeless. ✨ Experience the elegance of powdery iris, blended with woody and green notes, enriched by soft violet and aromatic accords. The result is a clean, modern fragrance that's smooth, masculine, and perfect for the gentleman who appreciates understated luxury. 🩵Perfect for everyday wear, the office, business meetings, evening dinners, and special occasions.",
    price: 5000,
    size: ["100ml"],
    gender: "Men",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-LON-SAV-100",
    barcode: "ZARA5",
    stock: 7,
    fragranceFamily: "Woody",
    occasion: ["Office", "Business Meetings", "Evening"],
    notes: {
      top: ["Iris", "Green Notes"],
      middle: ["Violet"],
      base: ["Woody Notes"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-dark-romance",
    name: "ZARA Dark Romance Eau de Parfum",
    brand: "ZARA",
    description: "Deep, sensual, and irresistibly elegant. ✨ Experience a luxurious blend of creamy vanilla and sweet gourmand notes, wrapped in warm amber, soft white florals, and a rich caramel undertone. The result is a bold, romantic fragrance that feels warm, addictive, and unforgettable. 🖤Perfect for date nights, evening wear, special occasions, and cold-weather moments.",
    price: 7500,
    size: ["80ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-DAR-ROM-80",
    barcode: "ZARA6",
    stock: 7,
    fragranceFamily: "Gourmand",
    occasion: ["Date Night", "Evening", "Special Occasions"],
    notes: {
      top: ["Vanilla", "Gourmand Notes"],
      middle: ["White Florals"],
      base: ["Amber", "Caramel"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-go-fruity",
    name: "ZARA Go Fruity Eau de Toilette",
    brand: "ZARA",
    description: "Fresh, playful, and effortlessly joyful. ✨ Experience a vibrant burst of citrus and juicy fruits, blending mandarin, red berries, and pear with a heart of soft jasmine, peach, and tropical fruits. It settles into a warm, smooth base of musk, cedarwood, and amber for a light yet lasting fruity signature. 💖Perfect for everyday wear, casual outings, daytime events, and warm weather moments.",
    price: 4500,
    size: ["100ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-GO-FRU-100",
    barcode: "ZARA7",
    stock: 7,
    fragranceFamily: "Fresh",
    occasion: ["Daily Wear", "Casual", "Summer"],
    notes: {
      top: ["Mandarin", "Red Berries", "Pear"],
      middle: ["Jasmine", "Peach", "Tropical Fruits"],
      base: ["Musk", "Cedarwood", "Amber"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-amber-fusion",
    name: "ZARA Amber Fusion Eau de Parfum",
    brand: "ZARA",
    description: "Fresh, radiant, and effortlessly sophisticated. ✨ Experience the sparkling brightness of citrus, the refreshing touch of marine accords, and the warmth of amber, aromatic woods, and sandalwood. The result is a clean, elegant fragrance that's vibrant, refined, and unforgettable. ✨ Perfect for everyday wear, the office, brunch dates, vacations, and warm-weather occasions.",
    price: 7500,
    size: ["80ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-AMB-FUS-80",
    barcode: "ZARA8",
    stock: 7,
    fragranceFamily: "Oriental",
    occasion: ["Daily Wear", "Office", "Brunch", "Vacation"],
    notes: {
      top: ["Citrus", "Marine Accord"],
      middle: ["Aromatic Woods"],
      base: ["Amber", "Sandalwood"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-man-silver",
    name: "ZARA Man Silver Eau de Toilette",
    brand: "ZARA",
    description: "Fresh, clean, and effortlessly masculine. ✨ 🩵 If you love Dior Sauvage, you'll enjoy Zara Man Silver. It delivers a fresh, citrus-woody scent with a clean masculine character at a fraction of the price. ✨ Perfect for everyday wear, the office, casual outings, gym sessions, and warm-weather days.",
    price: 4500,
    size: ["90ml"],
    gender: "Men",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-MAN-SIL-90",
    barcode: "ZARA9",
    stock: 7,
    fragranceFamily: "Woody",
    occasion: ["Daily Wear", "Office", "Gym", "Summer"],
    notes: {
      top: ["Citrus"],
      middle: ["Woody Notes"],
      base: ["Musk"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-pink-flambe",
    name: "ZARA Pink Flambé Eau de Toilette",
    brand: "ZARA",
    description: "Bright, playful, and effortlessly feminine. 💖 💖 If you love Dolce & Gabbana Light Blue, you'll adore Zara Pink Flambé. It offers a similarly fresh, citrusy and effortlessly chic vibe at a fraction of the price. ✨ Perfect for everyday wear, brunch dates, the office, vacations, and warm sunny days.",
    price: 5000,
    size: ["100ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-PIN-FLA-100",
    barcode: "ZARA10",
    stock: 7,
    fragranceFamily: "Citrus",
    occasion: ["Daily Wear", "Brunch", "Office", "Vacation"],
    notes: {
      top: ["Citrus"],
      middle: ["Floral Notes"],
      base: ["Woody Notes"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-hypnotic-vanilla",
    name: "ZARA Hypnotic Vanilla Eau de Parfum",
    brand: "ZARA",
    description: "Warm, creamy, and irresistibly addictive. ✨ Indulge in the comforting sweetness of rich vanilla bourbon, delicious caramel, delicate apricot blossom, and elegant jasmine. The result is a smooth, luxurious fragrance that feels cozy, sophisticated, and effortlessly captivating. 💖 If you love Billie Eilish Eau de Parfum or Kayali Vanilla 28, you'll adore Zara Hypnotic Vanilla. It offers a similar rich, creamy vanilla experience with warm caramel and floral touches—at a fraction of the price.",
    price: 7500,
    size: ["80ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-HYP-VAN-80",
    barcode: "ZARA11",
    stock: 7,
    fragranceFamily: "Gourmand",
    occasion: ["Evening", "Winter", "Special Occasions"],
    notes: {
      top: ["Vanilla Bourbon", "Caramel"],
      middle: ["Apricot Blossom", "Jasmine"],
      base: ["Musk"]
    },
    ingredients: [],
    reviews: []
  },
  {
    id: "zara-fields-at-nightfall-intense",
    name: "ZARA Fields at Nightfall Intense Eau de Parfum",
    brand: "ZARA",
    description: "Warm, sensual, and deeply captivating. ✨ Experience a rich blend of amber and warm spicy notes, wrapped in smooth vanilla sweetness and creamy white florals. Hints of soft powdery elegance and balsamic depth create a fragrance that feels bold, comforting, and irresistibly addictive. 🤎 If you love warm, sweet, seductive scents like YSL Libre Intense or Carolina Herrera Good Girl Blush Intense, you'll adore Zara Fields at Nightfall Intense. It delivers a luxurious amber-vanilla warmth with a soft floral touch at a fraction of the price.",
    price: 7500,
    size: ["100ml"],
    gender: "Women",
    rating: 0,
    reviewsCount: 0,
    images: ["https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600"],
    sku: "ZARA-FIE-NIG-INT-100",
    barcode: "ZARA12",
    stock: 7,
    fragranceFamily: "Oriental",
    occasion: ["Evening", "Date Night", "Winter"],
    notes: {
      top: ["Amber", "Warm Spicy Notes"],
      middle: ["Vanilla", "White Florals"],
      base: ["Powdery Notes", "Balsamic Notes"]
    },
    ingredients: [],
    reviews: []
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "Spotlight on ZARA Deep Garden: A Soft, Elegant Symphony",
    excerpt: "Experience the delicate blend of creamy white florals wrapped in juicy fruity freshness, soft tuberose depth, and a clean aquatic-green touch.",
    content: "Soft, elegant, and effortlessly feminine. ✨ The ZARA Deep Garden Eau de Parfum is an exquisite formulation designed for the modern woman who appreciates grace and subtlety.\n\n### The Olfactory Profile\nAt the first spray, you are greeted with the crisp, juicy freshness of pear intertwined with delicate white florals. As the fragrance settles onto your skin, the heart reveals a soft, luxurious tuberose that provides an elegant depth without being overpowering.\n\n### The Dry-Down\nEventually, the scent melts into a beautiful base of Tonka Bean, leaving a warm, clean, aquatic-green touch that feels fresh, light, and beautifully comforting all day long.\n\nPerfect for everyday wear, brunch dates, the office, and special occasions. If you want a signature scent that radiates quiet confidence, ZARA Deep Garden is a must-have in your collection. 💖",
    image: "/images/products catalog and hero slider/ZARA Deep Garden.jpeg",
    author: "Lady Isabella, Master Perfumer",
    date: "2026-07-06",
    category: "Perfume Reviews",
    tags: ["ZARA", "Floral", "Women", "Everyday Elegance"],
    likes: 312
  },
  {
    id: "b2",
    title: "ZARA Lisboa: The Modern Aquatic Classic",
    excerpt: "Discover Lisboa: a refreshing aquatic fragrance blended with bergamot, marine accord, lavender, and cedarwood. The ultimate fresh signature scent.",
    content: "Fresh, clean, and effortlessly modern. ✨ ZARA Lisboa Eau de Toilette is a masterclass in crisp, aquatic perfumery.\n\n### A Refreshing Opening\nThe fragrance bursts open with bright, zesty Bergamot and a vivid Marine Accord. It immediately evokes the sensation of a cool ocean breeze on a warm summer day in the Mediterranean.\n\n### The Heart & Base\nAs the initial citrus wave settles, a clean, aromatic Lavender emerges, offering a timeless barbershop elegance. This is firmly anchored by a solid, masculine Cedarwood base that provides impressive longevity and structure.\n\n### When to Wear It\nThe result is a cool, crisp scent that feels clean, elegant, and timeless. 🩵 Whether you are heading to the office, running daily errands, or enjoying a warm-weather outing, ZARA Lisboa is the perfect, versatile companion.",
    image: "/images/products catalog and hero slider/ZARA Lisboa.jpeg",
    author: "Dr. Ethan Brooks, Scent Historian",
    date: "2026-07-05",
    category: "Fragrance Highlights",
    tags: ["ZARA", "Fresh", "Men", "Aquatic"],
    likes: 245
  }
];

export const MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "c1",
    title: "Grand Opening Offer",
    description: "Get 15% off all premium fragrances on your first purchase.",
    code: "WELCOME15",
    discountValue: 15,
    discountType: "percentage",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    status: "active"
  },
  {
    id: "c2",
    title: "Luxury Discount",
    description: "Get Ksh 30 off orders above Ksh 200 for a luxury experience.",
    code: "LUXURY30",
    discountValue: 30,
    discountType: "fixed",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    status: "active"
  }
];

export const FAQS = [
  {
    question: "How long do D & E Essentials perfumes typically last on the skin?",
    answer: "Our fragrances are blended at exceptionally high concentrations (Eau de Parfum and Extrait de Parfum), meaning they contain 15% to 25% pure essential oils. Our wood-heavy formulations like Mystical Oud and Absolute Black typically last 8 to 12+ hours, while fresh-citrus scents like Celestial Fresh last 6 to 8 hours depending on skin chemistry.",
    category: "Fragrance Care"
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we ship across East Africa with direct courier delivery. Within Kenya, we offer next-day delivery via reliable partners, backed by Safaricom M-Pesa automatic processing.",
    category: "Shipping & Delivery"
  },
  {
    question: "What is the best way to apply and store my perfumes?",
    answer: "For maximum projection and longevity, apply your fragrance to warm pulse points: the insides of your wrists, behind your ears, the base of your throat, and behind your knees. Store your bottles in a cool, dry place away from direct sunlight and fluctuating temperatures (like the bathroom) to preserve the delicate oils.",
    category: "Fragrance Care"
  },
  {
    question: "Can I simulate M-Pesa payment if I am checking out from the sandbox?",
    answer: "Yes! Our platform features an interactive M-Pesa STK Push Simulator. When checking out, enter your phone number, and a virtual Safaricom smartphone mockup will slide onto your screen. You can enter a dummy PIN to simulate successful payment authorization, which instantly updates your order to 'Paid' in real-time!",
    category: "Payments"
  }
];
