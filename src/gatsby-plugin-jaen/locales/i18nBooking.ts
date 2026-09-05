// src/vars/i18nBooking.tsx
export type I18nCode = 'en-US' | 'de-AT' | 'tr-TR' | 'ar-EG'

/** Booking modal i18n only */
export function getI18nBooking(code: I18nCode) {
  if (code === 'de-AT') {
    return {
      code,
      strings: {
        BookingHeading: 'Reservierungsanfrage',
        BookingIntro:
          'Bitte fülle die Fahrtdetails und deine Kontaktdaten aus. Wir melden uns schnellstmöglich.',
        SectionRide: 'Fahrt',
        LabelCategory: 'Kategorie',
        CategoryDistance: 'Distanz',
        CategoryHourly: 'Stündlich',
        CategoryFlatrate: 'Flatrate',
        LabelType: 'Art',
        TypeOneWay: 'Einweg',
        TypeReturn: 'Rückfahrt',
        LabelDate: 'Datum',
        LabelTime: 'Abholzeit',
        LabelReturnDate: 'Rückfahrtdatum',
        LabelReturnTime: 'Abholzeit Rückfahrt',
        ReturnRequired: 'Für eine Rückfahrt erforderlich',
        ReturnAfterOutbound: 'Die Rückfahrt muss nach der Hinfahrt liegen',
        LabelPickup: 'Abholadresse',
        LabelDestination: 'Zieladresse',
        LabelPassengers: 'Passagieranzahl',
        LabelLuggage: 'Gepäckanzahl',
        LabelChildSeats: 'Kindersitz',
        LabelExtraTime: 'Zusätzliche Zeit (Std.)',

        // section title (kept for compatibility, now includes payment)
        SectionVehiclePrice: 'Fahrzeug & Zahlung',
        LabelCarClass: 'Fahrzeugklasse',
        LabelCarTitle: 'Fahrzeug',

        // NEW payment labels
        LabelPaymentOption: 'Zahlungsart',
        PaymentCash: 'Bar',
        PaymentCard: 'Karte',
        PaymentTransfer: 'Überweisung',

        SectionContact: 'Kontaktdetails',
        // localized (were English before)
        LabelFirstName: 'Vorname',
        LabelLastName: 'Nachname',
        LabelEmail: 'E-Mail',
        LabelPhone: 'Telefon',
        LabelFlightNumber: 'Flugnummer',
        LabelWishes: 'Wünsche',
        WishesPlaceholder: 'Wünsche oder Hinweise',
        ConsentText:
          'Ich bin damit einverstanden, dass meine Angaben zur Kontaktaufnahme und für Rückfragen gespeichert werden.',
        ConsentError: 'Bitte bestätige die Bedingungen zur Kontaktaufnahme',
        SubmitCta: 'Reservieren',
        LabelBooking: 'Buchung',
        ToastApiBookingErrorTitle: 'Buchung noch nicht im System',
        ToastApiBookingErrorDesc:
          'Wir konnten die Buchung nicht in unserem System anlegen. Deine Anfrage wird trotzdem per E-Mail gesendet.',

        // Booking view (dashboard)
        BookingsHeading: 'Meine Buchungen ({count})',
        BookingModalHeading: 'Transfer buchen',
        BookingLabelDate: 'Datum',
        BookingErrorDateRequired: 'Datum ist erforderlich',
        BookingLabelTime: 'Uhrzeit',
        BookingErrorTimeRequired: 'Uhrzeit ist erforderlich',
        BookingLabelPickup: 'Abholung',
        BookingPlaceholderPickup: 'Hotel, Adresse, etc.',
        BookingErrorPickupRequired: 'Abholung ist erforderlich',
        BookingLabelDropoff: 'Ziel',
        BookingPlaceholderDropoff: 'Flughafen, Adresse, etc.',
        BookingErrorDropoffRequired: 'Ziel ist erforderlich',
        BookingLabelRoomOrName: 'Zimmer / Name',
        BookingPlaceholderRoomOrName: 'Zimmer 101 / Hr. Mustermann',
        BookingLabelVehicleClass: 'Fahrzeugklasse',
        BookingPlaceholderSelectClass: 'Klasse auswählen',
        BookingLabelPaymentMethod: 'Zahlungsart',
        BookingPlaceholderSelectPayment: 'Zahlungsart auswählen',
        BookingSubmitCreate: 'Buchen',
        BookingButtonBookTransfer: 'Transfer buchen',
        BookingLabelVehicle: 'Fahrzeug',
        BookingLabelPrice: 'Preis',
        BookingLabelPayment: 'Zahlung',
        TableHeader_Actions: 'Aktionen',
        BookingCancelModalHeading: 'Buchung stornieren?',
        BookingCancelModalBody:
          'Bist du sicher, dass du diese Transferbuchung stornieren möchtest?',
        BookingCancelKeep: 'Buchung behalten',
        BookingCancelConfirm: 'Buchung stornieren'
      }
    }
  }

  if (code === 'tr-TR') {
    return {
      code,
      strings: {
        BookingHeading: 'Rezervasyon talebi',
        BookingIntro:
          'Lütfen yolculuk ve iletişim bilgilerini doldurun. En kısa sürede geri döneceğiz.',
        SectionRide: 'Yolculuk',
        LabelCategory: 'Kategori',
        CategoryDistance: 'Mesafe',
        CategoryHourly: 'Saatlik',
        CategoryFlatrate: 'Sabit ücret',
        LabelType: 'Tür',
        TypeOneWay: 'Tek yön',
        TypeReturn: 'Gidiş-dönüş',
        LabelDate: 'Tarih',
        LabelTime: 'Alış saati',
        LabelReturnDate: 'Dönüş tarihi',
        LabelReturnTime: 'Dönüş alış saati',
        ReturnRequired: 'Dönüş için gereklidir',
        ReturnAfterOutbound: 'Dönüş, gidişten sonra olmalıdır',
        LabelPickup: 'Alış adresi',
        LabelDestination: 'Varış adresi',
        LabelPassengers: 'Yolcu sayısı',
        LabelLuggage: 'Bagaj sayısı',
        LabelChildSeats: 'Çocuk koltuğu',
        LabelExtraTime: 'Ek süre (saat)',

        // section title (kept for compatibility, now includes payment)
        SectionVehiclePrice: 'Araç & Ödeme',
        LabelCarClass: 'Araç sınıfı',
        LabelCarTitle: 'Araç',

        // NEW payment labels
        LabelPaymentOption: 'Ödeme yöntemi',
        PaymentCash: 'Nakit',
        PaymentCard: 'Kart',
        PaymentTransfer: 'Havale/EFT',

        SectionContact: 'İletişim bilgileri',
        // localized (were English before)
        LabelFirstName: 'Ad',
        LabelLastName: 'Soyad',
        LabelEmail: 'E-posta',
        LabelPhone: 'Telefon',
        LabelFlightNumber: 'Uçuş numarası',
        LabelWishes: 'İstekler',
        WishesPlaceholder: 'İstek veya not',
        ConsentText:
          'İletişim ve geri dönüş için verilerimin saklanmasına izin veriyorum.',
        ConsentError: 'Lütfen iletişim iznini onaylayın',
        SubmitCta: 'Rezervasyon',
        LabelBooking: 'Rezervasyon',
        ToastApiBookingErrorTitle: 'Rezervasyon henüz sistemde değil',
        ToastApiBookingErrorDesc:
          'Rezervasyonu sistemimizde oluşturamadık. Talebiniz yine de e-posta ile gönderilecek.',

        // Booking view (dashboard)
        BookingsHeading: 'Rezervasyonlarım ({count})',
        BookingModalHeading: 'Transfer rezervasyonu',
        BookingLabelDate: 'Tarih',
        BookingErrorDateRequired: 'Tarih gereklidir',
        BookingLabelTime: 'Saat',
        BookingErrorTimeRequired: 'Saat gereklidir',
        BookingLabelPickup: 'Alış',
        BookingPlaceholderPickup: 'Otel, adres, vb.',
        BookingErrorPickupRequired: 'Alış adresi gereklidir',
        BookingLabelDropoff: 'Bırakış',
        BookingPlaceholderDropoff: 'Havalimanı, adres, vb.',
        BookingErrorDropoffRequired: 'Bırakış adresi gereklidir',
        BookingLabelRoomOrName: 'Oda / İsim',
        BookingPlaceholderRoomOrName: 'Oda 101 / Bay Yılmaz',
        BookingLabelVehicleClass: 'Araç sınıfı',
        BookingPlaceholderSelectClass: 'Sınıf seçin',
        BookingLabelPaymentMethod: 'Ödeme yöntemi',
        BookingPlaceholderSelectPayment: 'Ödeme yöntemi seçin',
        BookingSubmitCreate: 'Rezerve et',
        BookingButtonBookTransfer: 'Transfer rezervasyonu',
        BookingLabelVehicle: 'Araç',
        BookingLabelPrice: 'Fiyat',
        BookingLabelPayment: 'Ödeme',
        TableHeader_Actions: 'İşlemler',
        BookingCancelModalHeading: 'Rezervasyonu iptal et?',
        BookingCancelModalBody:
          'Bu transfer rezervasyonunu iptal etmek istediğinizden emin misiniz?',
        BookingCancelKeep: 'Rezervasyonu koru',
        BookingCancelConfirm: 'Rezervasyonu iptal et'
      }
    }
  }

  if (code === 'ar-EG') {
    return {
      code,
      strings: {
        BookingHeading: 'طلب حجز',
        BookingIntro:
          'يرجى إدخال تفاصيل الرحلة ومعلومات الاتصال. سنعاود التواصل معك قريبًا.',
        SectionRide: 'الرحلة',
        LabelCategory: 'الفئة',
        CategoryDistance: 'بالـمسافة',
        CategoryHourly: 'بالساعة',
        CategoryFlatrate: 'سعر ثابت',
        LabelType: 'النوع',
        TypeOneWay: 'ذهاب فقط',
        TypeReturn: 'ذهاب وعودة',
        LabelDate: 'التاريخ',
        LabelTime: 'وقت الاستلام',
        LabelReturnDate: 'تاريخ العودة',
        LabelReturnTime: 'وقت الاستلام للعودة',
        ReturnRequired: 'مطلوب لرحلة العودة',
        ReturnAfterOutbound: 'يجب أن تكون العودة بعد رحلة الذهاب',
        LabelPickup: 'عنوان الاستلام',
        LabelDestination: 'عنوان الوجهة',
        LabelPassengers: 'عدد الركاب',
        LabelLuggage: 'عدد الحقائب',
        LabelChildSeats: 'مقاعد أطفال',
        LabelExtraTime: 'وقت إضافي (ساعات)',

        // section title (kept for compatibility, now includes payment)
        SectionVehiclePrice: 'المركبة والدفع',
        LabelCarClass: 'فئة المركبة',
        LabelCarTitle: 'المركبة',

        // NEW payment labels
        LabelPaymentOption: 'طريقة الدفع',
        PaymentCash: 'نقدًا',
        PaymentCard: 'بطاقة',
        PaymentTransfer: 'حوالة مصرفية',

        SectionContact: 'بيانات الاتصال',
        LabelFirstName: 'الاسم الأول',
        LabelLastName: 'اسم العائلة',
        LabelEmail: 'البريد الإلكتروني',
        LabelPhone: 'الهاتف',
        LabelFlightNumber: 'رقم الرحلة',
        LabelWishes: 'ملاحظات',
        WishesPlaceholder: 'ملاحظات أو طلبات خاصة',
        ConsentText:
          'أوافق على حفظ بياناتي لغرض التواصل والرد على الاستفسارات.',
        ConsentError: 'يرجى تأكيد إذن التواصل',
        SubmitCta: 'إرسال الحجز',
        LabelBooking: 'الحجز',
        ToastApiBookingErrorTitle: 'الحجز لم يُسجَّل في النظام بعد',
        ToastApiBookingErrorDesc:
          'تعذر إنشاء الحجز في نظامنا. سيتم إرسال طلبك عبر البريد الإلكتروني على أي حال.',

        // Booking view (dashboard)
        BookingsHeading: 'حجوزاتي ({count})',
        BookingModalHeading: 'حجز نقل',
        BookingLabelDate: 'التاريخ',
        BookingErrorDateRequired: 'التاريخ مطلوب',
        BookingLabelTime: 'الوقت',
        BookingErrorTimeRequired: 'الوقت مطلوب',
        BookingLabelPickup: 'الاستلام',
        BookingPlaceholderPickup: 'فندق، عنوان، إلخ.',
        BookingErrorPickupRequired: 'عنوان الاستلام مطلوب',
        BookingLabelDropoff: 'التوصيل',
        BookingPlaceholderDropoff: 'مطار، عنوان، إلخ.',
        BookingErrorDropoffRequired: 'عنوان التوصيل مطلوب',
        BookingLabelRoomOrName: 'الغرفة / الاسم',
        BookingPlaceholderRoomOrName: 'غرفة ١٠١ / السيد أحمد',
        BookingLabelVehicleClass: 'فئة المركبة',
        BookingPlaceholderSelectClass: 'اختر الفئة',
        BookingLabelPaymentMethod: 'طريقة الدفع',
        BookingPlaceholderSelectPayment: 'اختر طريقة الدفع',
        BookingSubmitCreate: 'حجز',
        BookingButtonBookTransfer: 'حجز نقل',
        BookingLabelVehicle: 'المركبة',
        BookingLabelPrice: 'السعر',
        BookingLabelPayment: 'الدفع',
        TableHeader_Actions: 'الإجراءات',
        BookingCancelModalHeading: 'إلغاء هذا الحجز؟',
        BookingCancelModalBody:
          'هل أنت متأكد من أنك تريد إلغاء حجز النقل هذا؟',
        BookingCancelKeep: 'الاحتفاظ بالحجز',
        BookingCancelConfirm: 'إلغاء الحجز'
      }
    }
  }

  // EN fallback (defaults)
  return {
    code,
    strings: {
      BookingHeading: 'Reservation request',
      BookingIntro:
        'Please fill in ride details and your contact info. We’ll get back to you shortly.',
      SectionRide: 'Ride',
      LabelCategory: 'Category',
      CategoryDistance: 'Distance',
      CategoryHourly: 'Hourly',
      CategoryFlatrate: 'Flatrate',
      LabelType: 'Type',
      TypeOneWay: 'One-way',
      TypeReturn: 'Return',
      LabelDate: 'Date',
      LabelTime: 'Pickup time',
      LabelReturnDate: 'Return date',
      LabelReturnTime: 'Return pickup time',
      ReturnRequired: 'Required for a return trip',
      ReturnAfterOutbound: 'The return must be after the outbound ride',
      LabelPickup: 'Pickup address',
      LabelDestination: 'Destination address',
      LabelPassengers: 'Passengers',
      LabelLuggage: 'Luggage',
      LabelChildSeats: 'Child seats',
      LabelExtraTime: 'Extra time (hrs)',

      // section title (kept for compatibility, now includes payment)
      SectionVehiclePrice: 'Vehicle & Payment',
      LabelCarClass: 'Car class',
      LabelCarTitle: 'Vehicle',

      // NEW payment labels
      LabelPaymentOption: 'Payment option',
      PaymentCash: 'Cash',
      PaymentCard: 'Card',
      PaymentTransfer: 'Bank transfer',

      SectionContact: 'Contact details',
      LabelFirstName: 'First name',
      LabelLastName: 'Last name',
      LabelEmail: 'Email',
      LabelPhone: 'Phone',
      LabelFlightNumber: 'Flight number',
      LabelWishes: 'Notes',
      WishesPlaceholder: 'Notes or requests',
      ConsentText: 'I agree that my details may be stored for contact and follow-up.',
      ConsentError: 'Please confirm the contact permission',
      SubmitCta: 'Reserve',
      LabelBooking: 'Booking',
      ToastApiBookingErrorTitle: 'Booking not yet in the system',
      ToastApiBookingErrorDesc:
        'We could not create the booking in our system. Your request will still be sent by email.',

      // Booking view (dashboard)
      BookingsHeading: 'My bookings ({count})',
      BookingModalHeading: 'Book a transfer',
      BookingLabelDate: 'Date',
      BookingErrorDateRequired: 'Date is required',
      BookingLabelTime: 'Time',
      BookingErrorTimeRequired: 'Time is required',
      BookingLabelPickup: 'Pickup',
      BookingPlaceholderPickup: 'Hotel, address, etc.',
      BookingErrorPickupRequired: 'Pickup is required',
      BookingLabelDropoff: 'Dropoff',
      BookingPlaceholderDropoff: 'Airport, address, etc.',
      BookingErrorDropoffRequired: 'Dropoff is required',
      BookingLabelRoomOrName: 'Room / Name',
      BookingPlaceholderRoomOrName: 'Room 101 / Mr. Smith',
      BookingLabelVehicleClass: 'Vehicle class',
      BookingPlaceholderSelectClass: 'Select class',
      BookingLabelPaymentMethod: 'Payment method',
      BookingPlaceholderSelectPayment: 'Select payment',
      BookingSubmitCreate: 'Book',
      BookingButtonBookTransfer: 'Book transfer',
      BookingLabelVehicle: 'Vehicle',
      BookingLabelPrice: 'Price',
      BookingLabelPayment: 'Payment',
      TableHeader_Actions: 'Actions',
      BookingCancelModalHeading: 'Cancel this booking?',
      BookingCancelModalBody:
        'Are you sure you want to cancel this transfer booking?',
      BookingCancelKeep: 'Keep booking',
      BookingCancelConfirm: 'Cancel booking'
    }
  }
}
