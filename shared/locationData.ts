// بيانات المناطق الغنية لموقع الحجوزات
// Rich location data for property destinations

import { z } from 'zod';

// Schema definition for location data
export const locationSchema = z.object({
  id: z.string(),
  nameEn: z.string(),
  nameAr: z.string(),
  regionEn: z.string(),
  regionAr: z.string(),
  descriptionEn: z.string(),
  descriptionAr: z.string(),
  highlights: z.array(z.object({
    titleEn: z.string(),
    titleAr: z.string(),
    descriptionEn: z.string(),
    descriptionAr: z.string(),
    iconName: z.string().optional(),
  })),
  activities: z.array(z.object({
    nameEn: z.string(),
    nameAr: z.string(),
    descriptionEn: z.string().optional(),
    descriptionAr: z.string().optional(),
    iconName: z.string().optional(),
  })),
  bestTimeToVisit: z.object({
    seasonsEn: z.array(z.enum(['Spring', 'Summer', 'Fall', 'Winter'])),
    seasonsAr: z.array(z.enum(['الربيع', 'الصيف', 'الخريف', 'الشتاء'])),
    notesEn: z.string().optional(),
    notesAr: z.string().optional(),
  }),
  weather: z.object({
    summerTempRange: z.string(),
    winterTempRange: z.string(),
    rainfallEn: z.string(),
    rainfallAr: z.string(),
  }),
  gettingThere: z.object({
    fromCairoEn: z.string(),
    fromCairoAr: z.string(),
    fromAlexEn: z.string().optional(),
    fromAlexAr: z.string().optional(),
    nearestAirportEn: z.string().optional(),
    nearestAirportAr: z.string().optional(),
  }),
  neighborhoods: z.array(z.object({
    nameEn: z.string(),
    nameAr: z.string(),
    descriptionEn: z.string(),
    descriptionAr: z.string(),
    highlightsEn: z.array(z.string()).optional(),
    highlightsAr: z.array(z.string()).optional(),
    propertyTypes: z.array(z.string()).optional(),
  })),
  localTips: z.array(z.object({
    tipEn: z.string(),
    tipAr: z.string(),
    categoryEn: z.enum(['Food', 'Activities', 'Transportation', 'Culture', 'Safety', 'Budget']),
    categoryAr: z.enum(['الطعام', 'الأنشطة', 'المواصلات', 'الثقافة', 'الأمان', 'الميزانية']),
  })),
  images: z.array(z.string()),
  mapLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    zoomLevel: z.number().optional(),
  }),
});

// Types for TypeScript
export type LocationData = z.infer<typeof locationSchema>;
export type LocationHighlight = LocationData['highlights'][0];
export type LocationActivity = LocationData['activities'][0];
export type LocationNeighborhood = LocationData['neighborhoods'][0];
export type LocalTip = LocationData['localTips'][0];

// Rich data for North Coast (Sahel) locations
export const locationData: LocationData[] = [
  {
    id: 'sahel',
    nameEn: 'Egyptian North Coast (Sahel)',
    nameAr: 'الساحل الشمالي المصري',
    regionEn: 'Mediterranean Coast',
    regionAr: 'ساحل البحر المتوسط',
    descriptionEn: 
      'The North Coast of Egypt, locally known as Sahel, stretches along the Mediterranean Sea from Alexandria to Marsa Matruh, offering pristine beaches with crystal-clear turquoise waters. This premier summer destination features exclusive resorts, vibrant beach clubs, and luxurious vacation homes. Popular among both Egyptian locals and international travelers seeking Mediterranean beauty, Sahel combines natural splendor with modern amenities, making it the perfect getaway during the summer months when temperatures are ideal for beach activities.',
    descriptionAr: 
      'يمتد الساحل الشمالي لمصر، المعروف محليًا باسم الساحل، على طول البحر المتوسط من الإسكندرية إلى مرسى مطروح، ويقدم شواطئ بكر ذات مياه فيروزية صافية. تضم هذه الوجهة الصيفية الرائدة منتجعات حصرية ونوادي شاطئية نابضة بالحياة ومنازل عطلات فاخرة. الساحل مشهور بين المصريين والمسافرين الدوليين الباحثين عن جمال البحر المتوسط، حيث يجمع بين الروعة الطبيعية والمرافق الحديثة، مما يجعله الوجهة المثالية للاسترخاء خلال أشهر الصيف عندما تكون درجات الحرارة مثالية للأنشطة الشاطئية.',
    highlights: [
      {
        titleEn: 'Pristine Beaches',
        titleAr: 'شواطئ بكر',
        descriptionEn: 'Miles of white sandy beaches with crystal-clear turquoise waters perfect for swimming and water sports.',
        descriptionAr: 'أميال من الشواطئ الرملية البيضاء ذات المياه الفيروزية الصافية المثالية للسباحة والرياضات المائية.',
        iconName: 'Beach',
      },
      {
        titleEn: 'Exclusive Resorts',
        titleAr: 'منتجعات حصرية',
        descriptionEn: 'Luxury resorts and compounds offering world-class amenities and private beach access.',
        descriptionAr: 'منتجعات ومجمعات فاخرة توفر مرافق عالمية المستوى وإمكانية الوصول إلى الشاطئ الخاص.',
        iconName: 'Hotel',
      },
      {
        titleEn: 'Vibrant Beach Clubs',
        titleAr: 'نوادي شاطئية نابضة بالحياة',
        descriptionEn: 'Trendy beach clubs with pools, music, and social atmosphere perfect for day and night entertainment.',
        descriptionAr: 'نوادي شاطئية عصرية مع أحواض سباحة وموسيقى وأجواء اجتماعية مثالية للترفيه النهاري والليلي.',
        iconName: 'Music',
      },
      {
        titleEn: 'Water Activities',
        titleAr: 'أنشطة مائية',
        descriptionEn: 'Wide range of water sports including jet skiing, parasailing, windsurfing, and snorkeling.',
        descriptionAr: 'مجموعة واسعة من الرياضات المائية بما في ذلك ركوب الدراجات المائية والطيران المظلي وركوب الأمواج والغطس.',
        iconName: 'Waves',
      }
    ],
    activities: [
      {
        nameEn: 'Beach Relaxation',
        nameAr: 'الاسترخاء على الشاطئ',
        descriptionEn: 'Enjoy sunbathing and swimming in the crystal-clear Mediterranean waters.',
        descriptionAr: 'استمتع بأشعة الشمس والسباحة في مياه البحر المتوسط الصافية.',
        iconName: 'Sun',
      },
      {
        nameEn: 'Water Sports',
        nameAr: 'الرياضات المائية',
        descriptionEn: 'Try jet skiing, parasailing, banana boat rides, or windsurfing at most beaches.',
        descriptionAr: 'جرب ركوب الدراجات المائية أو الطيران المظلي أو رحلات قارب الموز أو ركوب الأمواج في معظم الشواطئ.',
        iconName: 'Sailboat',
      },
      {
        nameEn: 'Beach Clubs',
        nameAr: 'النوادي الشاطئية',
        descriptionEn: 'Spend the day at upscale beach clubs like Marassi, Hacienda, or Almaza Bay.',
        descriptionAr: 'اقضِ اليوم في نوادي الشاطئ الراقية مثل مراسي وهاسيندا والمازا باي.',
        iconName: 'Cocktail',
      },
      {
        nameEn: 'Seaside Dining',
        nameAr: 'تناول الطعام بجانب البحر',
        descriptionEn: 'Enjoy fresh seafood and Mediterranean cuisine at beachfront restaurants.',
        descriptionAr: 'استمتع بالمأكولات البحرية الطازجة والمطبخ المتوسطي في المطاعم المطلة على الشاطئ.',
        iconName: 'Fish',
      },
      {
        nameEn: 'Shopping',
        nameAr: 'التسوق',
        descriptionEn: 'Visit marina malls and boutique shops in places like Marina or Porto Marina.',
        descriptionAr: 'زيارة مراكز التسوق البحرية والمتاجر المتخصصة في أماكن مثل المارينا أو بورتو مارينا.',
        iconName: 'ShoppingBag',
      }
    ],
    bestTimeToVisit: {
      seasonsEn: ['Summer'],
      seasonsAr: ['الصيف'],
      notesEn: 'Peak season runs from June to September with ideal weather for beach activities.',
      notesAr: 'موسم الذروة يمتد من يونيو إلى سبتمبر مع طقس مثالي للأنشطة الشاطئية.',
    },
    weather: {
      summerTempRange: '25°C - 32°C',
      winterTempRange: '12°C - 20°C',
      rainfallEn: 'Minimal rainfall during summer months, occasional showers in winter.',
      rainfallAr: 'هطول أمطار قليل خلال أشهر الصيف، زخات عرضية في الشتاء.',
    },
    gettingThere: {
      fromCairoEn: 'Approximately 2-3 hours by car via Cairo-Alexandria Desert Road.',
      fromCairoAr: 'حوالي 2-3 ساعات بالسيارة عبر طريق القاهرة-الإسكندرية الصحراوي.',
      fromAlexEn: 'From Alexandria, 30 minutes to 2 hours depending on the destination.',
      fromAlexAr: 'من الإسكندرية، 30 دقيقة إلى ساعتين حسب الوجهة.',
      nearestAirportEn: 'Borg El Arab International Airport (Alexandria) or El Alamein International Airport.',
      nearestAirportAr: 'مطار برج العرب الدولي (الإسكندرية) أو مطار العلمين الدولي.',
    },
    neighborhoods: [
      {
        nameEn: 'Marina El Alamein',
        nameAr: 'مارينا العلمين',
        descriptionEn: 'One of the first developed resort areas in Sahel, featuring a marina, golf course, and multiple compounds.',
        descriptionAr: 'واحدة من أولى مناطق المنتجعات المطورة في الساحل، وتضم مرسى ليخوت وملعب غولف ومجمعات متعددة.',
        highlightsEn: ['Marina for yachts', 'Mediterranean-style architecture', 'Established community'],
        highlightsAr: ['مرسى لليخوت', 'عمارة على الطراز المتوسطي', 'مجتمع راسخ'],
        propertyTypes: ['apartments', 'villas', 'chalets']
      },
      {
        nameEn: 'Marassi',
        nameAr: 'مراسي',
        descriptionEn: 'Upscale integrated resort community with international beach clubs, golf course, and luxury residences.',
        descriptionAr: 'مجتمع منتجع متكامل راقي مع نوادي شاطئية دولية وملعب غولف ومساكن فاخرة.',
        highlightsEn: ['Luxury beach clubs', 'Golf course', 'High-end dining options'],
        highlightsAr: ['نوادي شاطئية فاخرة', 'ملعب غولف', 'خيارات طعام راقية'],
        propertyTypes: ['apartments', 'villas', 'twin houses']
      },
      {
        nameEn: 'Hacienda Bay',
        nameAr: 'هاسيندا باي',
        descriptionEn: 'Popular compound with beautiful beaches, clubhouse, and family-friendly atmosphere.',
        descriptionAr: 'مجمع شهير مع شواطئ جميلة ونادي وأجواء مناسبة للعائلات.',
        highlightsEn: ['Long sandy beach', 'Vibrant beach club', 'Well-established community'],
        highlightsAr: ['شاطئ رملي طويل', 'نادي شاطئي نابض بالحياة', 'مجتمع راسخ'],
        propertyTypes: ['chalets', 'villas', 'twin houses']
      },
      {
        nameEn: 'Almaza Bay',
        nameAr: 'الماظة باي',
        descriptionEn: 'Luxurious beachfront development with crystal-clear turquoise waters and pristine beaches.',
        descriptionAr: 'تطوير فاخر على الواجهة البحرية مع مياه فيروزية صافية وشواطئ بكر.',
        highlightsEn: ['Crystal-clear water', 'International resorts', 'Pristine beach'],
        highlightsAr: ['مياه صافية كالكريستال', 'منتجعات دولية', 'شاطئ بكر'],
        propertyTypes: ['apartments', 'chalets', 'cabanas']
      }
    ],
    localTips: [
      {
        tipEn: 'Book accommodations well in advance for the summer season, especially weekends.',
        tipAr: 'احجز أماكن الإقامة قبل موسم الصيف بوقت كافٍ، خاصة في عطلات نهاية الأسبوع.',
        categoryEn: 'Activities',
        categoryAr: 'الأنشطة',
      },
      {
        tipEn: 'Many beach clubs offer day-use options if you\'re not staying at the resort.',
        tipAr: 'تقدم العديد من النوادي الشاطئية خيارات استخدام اليوم إذا كنت لا تقيم في المنتجع.',
        categoryEn: 'Activities',
        categoryAr: 'الأنشطة',
      },
      {
        tipEn: 'Traffic can be heavy on weekends, especially Thursday and Friday evenings.',
        tipAr: 'يمكن أن تكون حركة المرور كثيفة في عطلات نهاية الأسبوع، خاصة مساء الخميس والجمعة.',
        categoryEn: 'Transportation',
        categoryAr: 'المواصلات',
      },
      {
        tipEn: 'Fresh seafood is a must-try in restaurants along the coast.',
        tipAr: 'يجب تجربة المأكولات البحرية الطازجة في المطاعم على طول الساحل.',
        categoryEn: 'Food',
        categoryAr: 'الطعام',
      },
      {
        tipEn: 'Pack sunscreen, hats, and beach essentials as they can be expensive in resort areas.',
        tipAr: 'احزم واقي الشمس والقبعات ومستلزمات الشاطئ حيث يمكن أن تكون باهظة الثمن في مناطق المنتجعات.',
        categoryEn: 'Budget',
        categoryAr: 'الميزانية',
      }
    ],
    images: [
      '/images/destinations/sahel-beach.jpg',
      '/images/destinations/sahel-resort.jpg',
      '/images/destinations/sahel-beachclub.jpg',
      '/images/destinations/sahel-watersports.jpg',
    ],
    mapLocation: {
      latitude: 30.8503,
      longitude: 28.9471,
      zoomLevel: 9
    }
  },
  {
    id: 'ras-el-hekma',
    nameEn: 'Ras El Hekma',
    nameAr: 'رأس الحكمة',
    regionEn: 'North Coast',
    regionAr: 'الساحل الشمالي',
    descriptionEn: 
      'Ras El Hekma is a pristine coastal paradise located on Egypt\'s North Coast, known for its unspoiled beaches and crystal-clear turquoise waters. This emerging destination offers a more secluded and serene alternative to the busier parts of Sahel, making it perfect for those seeking tranquility and natural beauty. With its crescent-shaped bay, protected position, and rapidly developing luxury resorts and residential projects, Ras El Hekma is quickly becoming one of Egypt\'s most coveted coastal retreats.',
    descriptionAr: 
      'رأس الحكمة هي جنة ساحلية بكر تقع على الساحل الشمالي لمصر، وتشتهر بشواطئها النقية ومياهها الفيروزية الصافية. توفر هذه الوجهة الناشئة بديلاً أكثر هدوءًا وصفاءً من الأجزاء الأكثر ازدحامًا في الساحل، مما يجعلها مثالية لأولئك الذين يبحثون عن الهدوء والجمال الطبيعي. مع خليجها على شكل هلال، وموقعها المحمي، والمنتجعات الفاخرة والمشاريع السكنية التي تتطور بسرعة، أصبحت رأس الحكمة بسرعة واحدة من أكثر الملاذات الساحلية المرغوبة في مصر.',
    highlights: [
      {
        titleEn: 'Secluded Beaches',
        titleAr: 'شواطئ معزولة',
        descriptionEn: 'Pristine beaches with fine white sand and incredibly clear azure waters, often less crowded than other North Coast areas.',
        descriptionAr: 'شواطئ بكر ذات رمال بيضاء ناعمة ومياه زرقاء صافية بشكل لا يصدق، وغالبًا ما تكون أقل ازدحامًا من مناطق الساحل الشمالي الأخرى.',
        iconName: 'Beach',
      },
      {
        titleEn: 'Protected Bay',
        titleAr: 'خليج محمي',
        descriptionEn: 'Naturally protected crescent-shaped bay creating calm waters ideal for swimming and water activities.',
        descriptionAr: 'خليج محمي طبيعيًا على شكل هلال يخلق مياهًا هادئة مثالية للسباحة والأنشطة المائية.',
        iconName: 'Waves',
      },
      {
        titleEn: 'Luxury Developments',
        titleAr: 'تطويرات فاخرة',
        descriptionEn: 'Emerging luxury resorts and residential communities offering high-end amenities and exclusive experiences.',
        descriptionAr: 'منتجعات فاخرة ناشئة ومجتمعات سكنية توفر وسائل راحة راقية وتجارب حصرية.',
        iconName: 'Building',
      },
      {
        titleEn: 'Natural Beauty',
        titleAr: 'جمال طبيعي',
        descriptionEn: 'Stunning coastline with natural rock formations, pristine waters, and preserved coastal environment.',
        descriptionAr: 'ساحل مذهل مع تكوينات صخرية طبيعية، ومياه نقية، وبيئة ساحلية محفوظة.',
        iconName: 'Mountain',
      }
    ],
    activities: [
      {
        nameEn: 'Beach Relaxation',
        nameAr: 'الاسترخاء على الشاطئ',
        descriptionEn: 'Enjoy the pristine beaches with crystal-clear waters and soft white sand.',
        descriptionAr: 'استمتع بالشواطئ البكر ذات المياه الصافية والرمال البيضاء الناعمة.',
        iconName: 'Sun',
      },
      {
        nameEn: 'Swimming',
        nameAr: 'السباحة',
        descriptionEn: 'The protected bay creates calm waters perfect for swimming and wading.',
        descriptionAr: 'يخلق الخليج المحمي مياهًا هادئة مثالية للسباحة والخوض.',
        iconName: 'Swimmer',
      },
      {
        nameEn: 'Snorkeling',
        nameAr: 'الغطس',
        descriptionEn: 'Explore marine life in the clear waters around natural rock formations.',
        descriptionAr: 'استكشف الحياة البحرية في المياه الصافية حول التكوينات الصخرية الطبيعية.',
        iconName: 'Dive',
      },
      {
        nameEn: 'Waterfront Dining',
        nameAr: 'تناول الطعام على الواجهة البحرية',
        descriptionEn: 'Enjoy meals with spectacular sea views at resort restaurants.',
        descriptionAr: 'استمتع بوجبات مع إطلالات بحرية رائعة في مطاعم المنتجع.',
        iconName: 'Utensils',
      },
      {
        nameEn: 'Sunset Watching',
        nameAr: 'مشاهدة غروب الشمس',
        descriptionEn: 'Experience breathtaking sunsets over the Mediterranean waters.',
        descriptionAr: 'استمتع بمشاهدة غروب الشمس الخلاب على مياه البحر المتوسط.',
        iconName: 'Sunset',
      }
    ],
    bestTimeToVisit: {
      seasonsEn: ['Summer'],
      seasonsAr: ['الصيف'],
      notesEn: 'May through October offers ideal weather. July and August are peak season with perfect swimming conditions.',
      notesAr: 'يوفر شهر مايو حتى أكتوبر طقسًا مثاليًا. يوليو وأغسطس هما موسم الذروة مع ظروف سباحة مثالية.',
    },
    weather: {
      summerTempRange: '25°C - 35°C',
      winterTempRange: '14°C - 22°C',
      rainfallEn: 'Very minimal rainfall in summer, occasional light showers in winter months.',
      rainfallAr: 'هطول أمطار قليل جدًا في الصيف، زخات خفيفة متفرقة في أشهر الشتاء.',
    },
    gettingThere: {
      fromCairoEn: 'Approximately 3-3.5 hours by car via Cairo-Alexandria Desert Road and Coastal Road.',
      fromCairoAr: 'حوالي 3-3.5 ساعات بالسيارة عبر طريق القاهرة-الإسكندرية الصحراوي والطريق الساحلي.',
      fromAlexEn: 'About 2-2.5 hours from Alexandria via the Coastal Road.',
      fromAlexAr: 'حوالي 2-2.5 ساعة من الإسكندرية عبر الطريق الساحلي.',
      nearestAirportEn: 'El Alamein International Airport (approximately 30-40 minutes by car).',
      nearestAirportAr: 'مطار العلمين الدولي (حوالي 30-40 دقيقة بالسيارة).',
    },
    neighborhoods: [
      {
        nameEn: 'Ras El Hekma Bay',
        nameAr: 'خليج رأس الحكمة',
        descriptionEn: 'The main bay area with the clearest waters and most protected beaches in the region.',
        descriptionAr: 'منطقة الخليج الرئيسية ذات المياه الأكثر صفاءً والشواطئ الأكثر حماية في المنطقة.',
        highlightsEn: ['Crescent-shaped protected bay', 'Crystal-clear waters', 'Fine white sand'],
        highlightsAr: ['خليج محمي على شكل هلال', 'مياه صافية كالكريستال', 'رمال بيضاء ناعمة'],
        propertyTypes: ['villas', 'chalets', 'luxury resorts']
      },
      {
        nameEn: 'Fouka Bay',
        nameAr: 'فوكا باي',
        descriptionEn: 'Luxury development area with contemporary architecture and exclusive beach access.',
        descriptionAr: 'منطقة تطوير فاخرة ذات عمارة معاصرة وإمكانية الوصول الحصري إلى الشاطئ.',
        highlightsEn: ['Modern design', 'Private beach areas', 'High-end amenities'],
        highlightsAr: ['تصميم حديث', 'مناطق شاطئية خاصة', 'وسائل راحة راقية'],
        propertyTypes: ['chalets', 'twin houses', 'apartments']
      },
      {
        nameEn: 'Tal Hekma',
        nameAr: 'تل الحكمة',
        descriptionEn: 'Elevated area offering stunning panoramic views of the Mediterranean Sea.',
        descriptionAr: 'منطقة مرتفعة توفر إطلالات بانورامية مذهلة على البحر المتوسط.',
        highlightsEn: ['Panoramic sea views', 'Elevated position', 'Sunset vistas'],
        highlightsAr: ['إطلالات بانورامية على البحر', 'موقع مرتفع', 'مناظر غروب الشمس'],
        propertyTypes: ['villas', 'luxury compounds']
      }
    ],
    localTips: [
      {
        tipEn: 'The area is still developing, so stock up on necessities before arriving.',
        tipAr: 'المنطقة لا تزال قيد التطوير، لذا قم بتخزين الضروريات قبل الوصول.',
        categoryEn: 'Budget',
        categoryAr: 'الميزانية',
      },
      {
        tipEn: 'Bring water shoes for swimming as some areas have natural rocks.',
        tipAr: 'أحضر أحذية مائية للسباحة حيث توجد في بعض المناطق صخور طبيعية.',
        categoryEn: 'Activities',
        categoryAr: 'الأنشطة',
      },
      {
        tipEn: 'Consider renting a car as public transportation options are limited.',
        tipAr: 'فكر في استئجار سيارة حيث أن خيارات المواصلات العامة محدودة.',
        categoryEn: 'Transportation',
        categoryAr: 'المواصلات',
      },
      {
        tipEn: 'Reserve accommodations well in advance during summer months.',
        tipAr: 'احجز أماكن الإقامة قبل وقت طويل خلال أشهر الصيف.',
        categoryEn: 'Activities',
        categoryAr: 'الأنشطة',
      },
      {
        tipEn: 'The waters are generally calm, making it ideal for families with children.',
        tipAr: 'المياه هادئة بشكل عام، مما يجعلها مثالية للعائلات التي لديها أطفال.',
        categoryEn: 'Safety',
        categoryAr: 'الأمان',
      }
    ],
    images: [
      '/images/destinations/ras-el-hekma-bay.jpg',
      '/images/destinations/ras-el-hekma-beach.jpg',
      '/images/destinations/ras-el-hekma-shore.jpg',
      '/images/destinations/ras-el-hekma-resort.jpg',
    ],
    mapLocation: {
      latitude: 31.0944,
      longitude: 28.3436,
      zoomLevel: 12
    }
  }
];

// Export a utility function to get location by ID
export function getLocationById(id: string): LocationData | undefined {
  return locationData.find(location => location.id === id);
}

// Export a utility function to get all locations
export function getAllLocations(): LocationData[] {
  return locationData;
}