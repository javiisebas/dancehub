export enum CurrencyEnum {
    // Major World Currencies
    USD = 'USD', // United States Dollar
    EUR = 'EUR', // Euro
    GBP = 'GBP', // British Pound Sterling
    JPY = 'JPY', // Japanese Yen
    CHF = 'CHF', // Swiss Franc

    // Americas
    CAD = 'CAD', // Canadian Dollar
    MXN = 'MXN', // Mexican Peso
    BRL = 'BRL', // Brazilian Real
    ARS = 'ARS', // Argentine Peso
    CLP = 'CLP', // Chilean Peso
    COP = 'COP', // Colombian Peso
    PEN = 'PEN', // Peruvian Sol
    UYU = 'UYU', // Uruguayan Peso
    VES = 'VES', // Venezuelan Bolívar Soberano
    BOB = 'BOB', // Bolivian Boliviano
    PYG = 'PYG', // Paraguayan Guaraní
    DOP = 'DOP', // Dominican Peso
    CRC = 'CRC', // Costa Rican Colón
    GTQ = 'GTQ', // Guatemalan Quetzal
    HNL = 'HNL', // Honduran Lempira
    NIO = 'NIO', // Nicaraguan Córdoba
    PAB = 'PAB', // Panamanian Balboa
    TTD = 'TTD', // Trinidad and Tobago Dollar

    // Asia & Pacific
    CNY = 'CNY', // Chinese Yuan
    HKD = 'HKD', // Hong Kong Dollar
    TWD = 'TWD', // New Taiwan Dollar
    SGD = 'SGD', // Singapore Dollar
    KRW = 'KRW', // South Korean Won
    INR = 'INR', // Indian Rupee
    IDR = 'IDR', // Indonesian Rupiah
    MYR = 'MYR', // Malaysian Ringgit
    PHP = 'PHP', // Philippine Peso
    THB = 'THB', // Thai Baht
    VND = 'VND', // Vietnamese Dong
    BDT = 'BDT', // Bangladeshi Taka
    PKR = 'PKR', // Pakistani Rupee
    NPR = 'NPR', // Nepalese Rupee
    LKR = 'LKR', // Sri Lankan Rupee
    MMK = 'MMK', // Myanmar Kyat
    KHR = 'KHR', // Cambodian Riel
    LAK = 'LAK', // Laotian Kip
    MNT = 'MNT', // Mongolian Tugrik
    AUD = 'AUD', // Australian Dollar
    NZD = 'NZD', // New Zealand Dollar
    FJD = 'FJD', // Fijian Dollar
    PGK = 'PGK', // Papua New Guinean Kina
    SBD = 'SBD', // Solomon Islands Dollar
    VUV = 'VUV', // Vanuatu Vatu

    // Middle East & Central Asia
    AED = 'AED', // United Arab Emirates Dirham
    SAR = 'SAR', // Saudi Riyal
    QAR = 'QAR', // Qatari Riyal
    OMR = 'OMR', // Omani Rial
    BHD = 'BHD', // Bahraini Dinar
    KWD = 'KWD', // Kuwaiti Dinar
    IQD = 'IQD', // Iraqi Dinar
    IRR = 'IRR', // Iranian Rial
    ILS = 'ILS', // Israeli New Shekel
    JOD = 'JOD', // Jordanian Dinar
    LBP = 'LBP', // Lebanese Pound
    SYP = 'SYP', // Syrian Pound
    YER = 'YER', // Yemeni Rial
    KZT = 'KZT', // Kazakhstani Tenge
    UZS = 'UZS', // Uzbekistani Som
    TJS = 'TJS', // Tajikistani Somoni
    TMT = 'TMT', // Turkmenistani Manat
    KGS = 'KGS', // Kyrgystani Som
    AFN = 'AFN', // Afghan Afghani

    // Europe
    RUB = 'RUB', // Russian Ruble
    SEK = 'SEK', // Swedish Krona
    NOK = 'NOK', // Norwegian Krone
    DKK = 'DKK', // Danish Krone
    ISK = 'ISK', // Icelandic Króna
    PLN = 'PLN', // Polish Złoty
    CZK = 'CZK', // Czech Koruna
    HUF = 'HUF', // Hungarian Forint
    RON = 'RON', // Romanian Leu
    BGN = 'BGN', // Bulgarian Lev
    HRK = 'HRK', // Croatian Kuna
    RSD = 'RSD', // Serbian Dinar
    ALL = 'ALL', // Albanian Lek
    MKD = 'MKD', // Macedonian Denar
    TRY = 'TRY', // Turkish Lira
    UAH = 'UAH', // Ukrainian Hryvnia
    BYN = 'BYN', // Belarusian Ruble
    MDL = 'MDL', // Moldovan Leu

    // Africa
    ZAR = 'ZAR', // South African Rand
    EGP = 'EGP', // Egyptian Pound
    NGN = 'NGN', // Nigerian Naira
    GHS = 'GHS', // Ghanaian Cedi
    KES = 'KES', // Kenyan Shilling
    TZS = 'TZS', // Tanzanian Shilling
    UGX = 'UGX', // Ugandan Shilling
    ETB = 'ETB', // Ethiopian Birr
    MAD = 'MAD', // Moroccan Dirham
    DZD = 'DZD', // Algerian Dinar
    TND = 'TND', // Tunisian Dinar
    LYD = 'LYD', // Libyan Dinar
    SDG = 'SDG', // Sudanese Pound
    XOF = 'XOF', // West African CFA Franc
    XAF = 'XAF', // Central African CFA Franc
    MUR = 'MUR', // Mauritian Rupee
    BWP = 'BWP', // Botswanan Pula
    ZMW = 'ZMW', // Zambian Kwacha
    MWK = 'MWK', // Malawian Kwacha
    NAD = 'NAD', // Namibian Dollar
    RWF = 'RWF', // Rwandan Franc
    BIF = 'BIF', // Burundian Franc
    SOS = 'SOS', // Somali Shilling
    DJF = 'DJF', // Djiboutian Franc
    GMD = 'GMD', // Gambian Dalasi
    SLL = 'SLL', // Sierra Leonean Leone
    GNF = 'GNF', // Guinean Franc

    // Others
    KYD = 'KYD', // Cayman Islands
    MGA = 'MGA', // Madagascar
    ERN = 'ERN', // Eritrea
    GYD = 'GYD', // Guyana
    JMD = 'JMD', // Jamaica
    SZL = 'SZL', // Eswatini
    BZD = 'BZD', // Belize
    AOA = 'AOA', // Angola
    CDF = 'CDF', // Democratic Republic of the Congo
    XCD = 'XCD', // East Caribbean Dollar
    BTN = 'BTN', // Bhutan
    AMD = 'AMD', // Armenia
    SCR = 'SCR', // Seychelles
    BSD = 'BSD', // Bahamas
    GEL = 'GEL', // Georgia
    SSP = 'SSP', // South Sudan
    MRU = 'MRU', // Mauritania
    MVR = 'MVR', // Maldives
    SVC = 'SVC', // El Salvador
    BMD = 'BMD', // Bermuda
    AZN = 'AZN', // Azerbaijan
    AWG = 'AWG', // Aruba
    BND = 'BND', // Brunei Darussalam
    MOP = 'MOP', // Macao
    TOP = 'TOP', // Tonga
    KPW = 'KPW', // North Korea
    ZWL = 'ZWL', // Zimbabwe
    CVE = 'CVE', // Cape Verde
    WST = 'WST', // Samoa
    BAM = 'BAM', // Bosnia and Herzegovina
    STN = 'STN', // Sao Tome and Principe
    LSL = 'LSL', // Lesotho
    CUP = 'CUP', // Cuba
    FKP = 'FKP', // Falkland Islands (Malvinas)
    GIP = 'GIP', // Gibraltar
    KMF = 'KMF', // Comoros
    BBD = 'BBD', // Barbados
    LRD = 'LRD', // Liberia
    MZN = 'MZN', // Mozambique
    SHP = 'SHP', // Saint Helena
    HTG = 'HTG', // Haiti
    ANG = 'ANG', // Curaçao
    XPF = 'XPF', // French Polynesia
    SRD = 'SRD', // Suriname

    // Cryptocurrencies (si se necesitan)
    BTC = 'BTC', // Bitcoin
    ETH = 'ETH', // Ethereum
    USDT = 'USDT', // Tether
    XRP = 'XRP', // Ripple
}
