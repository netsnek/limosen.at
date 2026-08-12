// src/vars/i18nTransfers.tsx
export type I18nCode = 'en-US' | 'de-AT' | 'tr-TR' | 'ar-EG'

/** Transfers page i18n only */
export function getI18nTransfers(code: I18nCode) {
  if (code === 'de-AT') {
    return {
      code,
      strings: {
        TransfersHeading: 'Transfers ({count})',

        // table headers
        TableHeader_Date: 'Datum',
        TableHeader_Time: 'Uhrzeit',
        TableHeader_Customer: 'Kunde',
        TableHeader_Driver: 'Fahrer',
        TableHeader_Pickup: 'Abholung',
        TableHeader_Dropoff: 'Ziel',
        TableHeader_Revenue: 'Umsatz',
        TableHeader_Payment: 'Zahlung',
        TableHeader_Status: 'Status',

        // status filter labels
        StatusFilter_all: 'Alle',
        StatusFilter_pending: 'Offen',
        StatusFilter_confirmed: 'Bestätigt',
        StatusFilter_complete: 'Abgeschlossen',
        StatusFilter_canceled: 'Storniert',
        StatusFilter_terminated: 'Beendet',

        // state labels (used in badges)
        TransferState_pending: 'Offen',
        TransferState_confirmed: 'Bestätigt',
        TransferState_complete: 'Abgeschlossen',
        TransferState_canceled: 'Storniert',
        TransferState_terminated: 'Beendet',

        // common buttons
        CommonCancel: 'Abbrechen',
        CommonAssign: 'Zuweisen',
        CommonCreate: 'Erstellen',
        CommonTerminate: 'Beenden',
        CommonComplete: 'Abschließen',
        CommonEdit: 'Bearbeiten',
        CommonConfirm: 'Bestätigen',

        // assign driver modal
        AssignDriverModalHeading: 'Fahrer zuweisen',
        AssignDriverModalLabelDriver: 'Fahrer',
        AssignDriverModalPlaceholderLoadingDrivers: 'Fahrer werden geladen…',
        AssignDriverModalPlaceholderSelectDriver: 'Fahrer auswählen',
        AssignDriverModalLabelCurrentPrice: 'Aktueller Preis',
        AssignDriverModalLabelOverridePrice: 'Preis überschreiben (EUR)',
        AssignDriverModalPlaceholderPrice: '100,00',
        AssignDriverModalHintKeepPrice:
          'Leer lassen, um den aktuellen Preis beizubehalten.',

        // add transfer modal
        AddTransferModalHeading: 'Transfer hinzufügen',
        AddTransferLabelCustomer: 'Kunde',
        AddTransferPlaceholderLoadingCustomers: 'Kunden werden geladen…',
        AddTransferPlaceholderSelectCustomer: 'Kunde auswählen',
        AddTransferErrorCustomerRequired: 'Kunde ist erforderlich',

        AddTransferLabelDate: 'Datum',
        AddTransferErrorDateRequired: 'Datum ist erforderlich',
        AddTransferLabelTime: 'Uhrzeit',
        AddTransferErrorTimeRequired: 'Uhrzeit ist erforderlich',

        AddTransferLabelPickup: 'Abholung',
        AddTransferPlaceholderPickup: 'Hotel, Adresse, etc.',
        AddTransferErrorPickupRequired: 'Abholung ist erforderlich',

        AddTransferLabelDropoff: 'Ziel',
        AddTransferPlaceholderDropoff: 'Flughafen, Adresse, etc.',
        AddTransferErrorDropoffRequired: 'Ziel ist erforderlich',

        AddTransferLabelRoomOrName: 'Zimmer / Name',
        AddTransferPlaceholderRoomOrName: 'Zimmer 101 / Hr. Mustermann',

        AddTransferLabelVehicleClass: 'Fahrzeugklasse',
        AddTransferPlaceholderSelectClass: 'Klasse auswählen',
        AddTransferLabelVehicle: 'Fahrzeug',
        AddTransferPlaceholderSelectVehicle: 'Fahrzeug auswählen',
        AddTransferPlaceholderSelectClassFirst: 'Zuerst Klasse wählen',

        AddTransferLabelAmountEUR: 'Betrag (EUR)',
        AddTransferPlaceholderAmountEUR: '100,00',

        AddTransferLabelPaymentMethod: 'Zahlungsart',
        AddTransferPlaceholderPaymentMethod: 'Zahlungsart auswählen',

        AddTransferButton: 'Transfer hinzufügen',

        // payment labels (for options)
        Payment_Cash: 'Bar',
        Payment_Card: 'Karte',
        Payment_Voucher: 'Gutschein',
        Payment_Invoice: 'Rechnung',

        // mobile labels
        MobileLabel_Customer: 'Kunde',
        MobileLabel_Driver: 'Fahrer',
        MobileLabel_Revenue: 'Umsatz',
        MobileLabel_Payment: 'Zahlung',

        // confirm modals
        CompleteModalHeading: 'Transfer als abgeschlossen markieren?',
        CompleteModalBody:
          'Möchtest du diesen Transfer wirklich als abgeschlossen markieren? Diese Aktion lässt sich ggf. nicht leicht rückgängig machen.',
        TerminateModalHeading: 'Transfer beenden?',
        TerminateModalBody:
          'Möchtest du diesen Transfer wirklich beenden? Diese Aktion ist in der Regel final.'
      }
    }
  }

  if (code === 'tr-TR') {
    return {
      code,
      strings: {
        TransfersHeading: 'Transferler ({count})',

        TableHeader_Date: 'Tarih',
        TableHeader_Time: 'Saat',
        TableHeader_Customer: 'Müşteri',
        TableHeader_Driver: 'Şoför',
        TableHeader_Pickup: 'Alış',
        TableHeader_Dropoff: 'Varış',
        TableHeader_Revenue: 'Gelir',
        TableHeader_Payment: 'Ödeme',
        TableHeader_Status: 'Durum',

        StatusFilter_all: 'Tümü',
        StatusFilter_pending: 'Beklemede',
        StatusFilter_confirmed: 'Onaylandı',
        StatusFilter_complete: 'Tamamlandı',
        StatusFilter_canceled: 'İptal edildi',
        StatusFilter_terminated: 'Sonlandırıldı',

        TransferState_pending: 'Beklemede',
        TransferState_confirmed: 'Onaylandı',
        TransferState_complete: 'Tamamlandı',
        TransferState_canceled: 'İptal edildi',
        TransferState_terminated: 'Sonlandırıldı',

        CommonCancel: 'İptal',
        CommonAssign: 'Ata',
        CommonCreate: 'Oluştur',
        CommonTerminate: 'Sonlandır',
        CommonComplete: 'Tamamla',
        CommonEdit: 'Düzenle',
        CommonConfirm: 'Onayla',

        AssignDriverModalHeading: 'Şoför ata',
        AssignDriverModalLabelDriver: 'Şoför',
        AssignDriverModalPlaceholderLoadingDrivers: 'Şoförler yükleniyor…',
        AssignDriverModalPlaceholderSelectDriver: 'Şoför seç',
        AssignDriverModalLabelCurrentPrice: 'Mevcut fiyat',
        AssignDriverModalLabelOverridePrice: 'Fiyatı değiştir (EUR)',
        AssignDriverModalPlaceholderPrice: '100,00',
        AssignDriverModalHintKeepPrice:
          'Mevcut fiyatı korumak için boş bırakın.',

        AddTransferModalHeading: 'Transfer ekle',
        AddTransferLabelCustomer: 'Müşteri',
        AddTransferPlaceholderLoadingCustomers: 'Müşteriler yükleniyor…',
        AddTransferPlaceholderSelectCustomer: 'Müşteri seç',
        AddTransferErrorCustomerRequired: 'Müşteri gerekli',

        AddTransferLabelDate: 'Tarih',
        AddTransferErrorDateRequired: 'Tarih gerekli',
        AddTransferLabelTime: 'Saat',
        AddTransferErrorTimeRequired: 'Saat gerekli',

        AddTransferLabelPickup: 'Alış',
        AddTransferPlaceholderPickup: 'Otel, adres, vb.',
        AddTransferErrorPickupRequired: 'Alış gerekli',

        AddTransferLabelDropoff: 'Varış',
        AddTransferPlaceholderDropoff: 'Havalimanı, adres, vb.',
        AddTransferErrorDropoffRequired: 'Varış gerekli',

        AddTransferLabelRoomOrName: 'Oda / İsim',
        AddTransferPlaceholderRoomOrName: 'Oda 101 / Ahmet Yılmaz',

        AddTransferLabelVehicleClass: 'Araç sınıfı',
        AddTransferPlaceholderSelectClass: 'Sınıf seç',
        AddTransferLabelVehicle: 'Araç',
        AddTransferPlaceholderSelectVehicle: 'Araç seç',
        AddTransferPlaceholderSelectClassFirst: 'Önce sınıf seçin',

        AddTransferLabelAmountEUR: 'Tutar (EUR)',
        AddTransferPlaceholderAmountEUR: '100,00',

        AddTransferLabelPaymentMethod: 'Ödeme yöntemi',
        AddTransferPlaceholderPaymentMethod: 'Ödeme yöntemi seç',

        AddTransferButton: 'Transfer ekle',

        Payment_Cash: 'Nakit',
        Payment_Card: 'Kart',
        Payment_Voucher: 'Kupon',
        Payment_Invoice: 'Fatura',

        MobileLabel_Customer: 'Müşteri',
        MobileLabel_Driver: 'Şoför',
        MobileLabel_Revenue: 'Gelir',
        MobileLabel_Payment: 'Ödeme',

        CompleteModalHeading: 'Transferi tamamlandı olarak işaretle?',
        CompleteModalBody:
          'Bu transferi tamamlandı olarak işaretlemek istediğinize emin misiniz? Bu işlem kolayca geri alınamayabilir.',
        TerminateModalHeading: 'Transferi sonlandır?',
        TerminateModalBody:
          'Bu transferi sonlandırmak istediğinize emin misiniz? Bu işlem genellikle kesindir.'
      }
    }
  }

  if (code === 'ar-EG') {
    return {
      code,
      strings: {
        TransfersHeading: 'الرحلات ({count})',

        TableHeader_Date: 'التاريخ',
        TableHeader_Time: 'الوقت',
        TableHeader_Customer: 'العميل',
        TableHeader_Driver: 'السائق',
        TableHeader_Pickup: 'نقطة الانطلاق',
        TableHeader_Dropoff: 'الوجهة',
        TableHeader_Revenue: 'الإيراد',
        TableHeader_Payment: 'الدفع',
        TableHeader_Status: 'الحالة',

        StatusFilter_all: 'الكل',
        StatusFilter_pending: 'قيد الانتظار',
        StatusFilter_confirmed: 'مؤكّد',
        StatusFilter_complete: 'مكتمل',
        StatusFilter_canceled: 'ملغى',
        StatusFilter_terminated: 'منتهٍ',

        TransferState_pending: 'قيد الانتظار',
        TransferState_confirmed: 'مؤكّد',
        TransferState_complete: 'مكتمل',
        TransferState_canceled: 'ملغى',
        TransferState_terminated: 'منتهٍ',

        CommonCancel: 'إلغاء',
        CommonAssign: 'تعيين',
        CommonCreate: 'إنشاء',
        CommonTerminate: 'إنهاء',
        CommonComplete: 'إكمال',
        CommonEdit: 'تعديل',
        CommonConfirm: 'تأكيد',

        AssignDriverModalHeading: 'تعيين سائق',
        AssignDriverModalLabelDriver: 'السائق',
        AssignDriverModalPlaceholderLoadingDrivers: 'جارٍ تحميل السائقين…',
        AssignDriverModalPlaceholderSelectDriver: 'اختر سائقًا',
        AssignDriverModalLabelCurrentPrice: 'السعر الحالي',
        AssignDriverModalLabelOverridePrice: 'تعديل السعر (يورو)',
        AssignDriverModalPlaceholderPrice: '100,00',
        AssignDriverModalHintKeepPrice:
          'اتركه فارغًا للاحتفاظ بالسعر الحالي.',

        AddTransferModalHeading: 'إضافة رحلة',
        AddTransferLabelCustomer: 'العميل',
        AddTransferPlaceholderLoadingCustomers: 'جارٍ تحميل العملاء…',
        AddTransferPlaceholderSelectCustomer: 'اختر عميلًا',
        AddTransferErrorCustomerRequired: 'العميل مطلوب',

        AddTransferLabelDate: 'التاريخ',
        AddTransferErrorDateRequired: 'التاريخ مطلوب',
        AddTransferLabelTime: 'الوقت',
        AddTransferErrorTimeRequired: 'الوقت مطلوب',

        AddTransferLabelPickup: 'نقطة الانطلاق',
        AddTransferPlaceholderPickup: 'فندق، عنوان، إلخ.',
        AddTransferErrorPickupRequired: 'نقطة الانطلاق مطلوبة',

        AddTransferLabelDropoff: 'الوجهة',
        AddTransferPlaceholderDropoff: 'مطار، عنوان، إلخ.',
        AddTransferErrorDropoffRequired: 'الوجهة مطلوبة',

        AddTransferLabelRoomOrName: 'الغرفة / الاسم',
        AddTransferPlaceholderRoomOrName: 'الغرفة 101 / السيد أحمد',

        AddTransferLabelVehicleClass: 'فئة المركبة',
        AddTransferPlaceholderSelectClass: 'اختر الفئة',
        AddTransferLabelVehicle: 'المركبة',
        AddTransferPlaceholderSelectVehicle: 'اختر المركبة',
        AddTransferPlaceholderSelectClassFirst: 'اختر الفئة أولًا',

        AddTransferLabelAmountEUR: 'المبلغ (يورو)',
        AddTransferPlaceholderAmountEUR: '100,00',

        AddTransferLabelPaymentMethod: 'طريقة الدفع',
        AddTransferPlaceholderPaymentMethod: 'اختر طريقة الدفع',

        AddTransferButton: 'إضافة رحلة',

        Payment_Cash: 'نقدًا',
        Payment_Card: 'بطاقة',
        Payment_Voucher: 'قسيمة',
        Payment_Invoice: 'فاتورة',

        MobileLabel_Customer: 'العميل',
        MobileLabel_Driver: 'السائق',
        MobileLabel_Revenue: 'الإيراد',
        MobileLabel_Payment: 'الدفع',

        CompleteModalHeading: 'وضع علامة كمكتمل؟',
        CompleteModalBody:
          'هل أنت متأكد أنك تريد وضع علامة على هذه الرحلة كمكتملة؟ قد لا يكون من السهل التراجع عن هذا الإجراء.',
        TerminateModalHeading: 'إنهاء الرحلة؟',
        TerminateModalBody:
          'هل أنت متأكد أنك تريد إنهاء هذه الرحلة؟ هذا الإجراء عادةً نهائي.'
      }
    }
  }

  // EN fallback
  return {
    code,
    strings: {
      TransfersHeading: 'Transfers ({count})',

      TableHeader_Date: 'Date',
      TableHeader_Time: 'Time',
      TableHeader_Customer: 'Customer',
      TableHeader_Driver: 'Driver',
      TableHeader_Pickup: 'Pickup',
      TableHeader_Dropoff: 'Dropoff',
      TableHeader_Revenue: 'Revenue',
      TableHeader_Payment: 'Payment',
      TableHeader_Status: 'Status',

      StatusFilter_all: 'All',
      StatusFilter_pending: 'Pending',
      StatusFilter_confirmed: 'Confirmed',
      StatusFilter_complete: 'Complete',
      StatusFilter_canceled: 'Canceled',
      StatusFilter_terminated: 'Terminated',

      TransferState_pending: 'pending',
      TransferState_confirmed: 'confirmed',
      TransferState_complete: 'complete',
      TransferState_canceled: 'canceled',
      TransferState_terminated: 'terminated',

      CommonCancel: 'Cancel',
      CommonAssign: 'Assign',
      CommonCreate: 'Create',
      CommonTerminate: 'Terminate',
      CommonComplete: 'Complete',
      CommonEdit: 'Edit',
      CommonConfirm: 'Confirm',

      AssignDriverModalHeading: 'Assign driver',
      AssignDriverModalLabelDriver: 'Driver',
      AssignDriverModalPlaceholderLoadingDrivers: 'Loading drivers…',
      AssignDriverModalPlaceholderSelectDriver: 'Select driver',
      AssignDriverModalLabelCurrentPrice: 'Current price',
      AssignDriverModalLabelOverridePrice: 'Override price (EUR)',
      AssignDriverModalPlaceholderPrice: '100,00',
      AssignDriverModalHintKeepPrice: 'Leave empty to keep current price.',

      AddTransferModalHeading: 'Add a transfer',
      AddTransferLabelCustomer: 'Customer',
      AddTransferPlaceholderLoadingCustomers: 'Loading customers…',
      AddTransferPlaceholderSelectCustomer: 'Select customer',
      AddTransferErrorCustomerRequired: 'Customer is required',

      AddTransferLabelDate: 'Date',
      AddTransferErrorDateRequired: 'Date is required',
      AddTransferLabelTime: 'Time',
      AddTransferErrorTimeRequired: 'Time is required',

      AddTransferLabelPickup: 'Pickup',
      AddTransferPlaceholderPickup: 'Hotel, address, etc.',
      AddTransferErrorPickupRequired: 'Pickup is required',

      AddTransferLabelDropoff: 'Dropoff',
      AddTransferPlaceholderDropoff: 'Airport, address, etc.',
      AddTransferErrorDropoffRequired: 'Dropoff is required',

      AddTransferLabelRoomOrName: 'Room / Name',
      AddTransferPlaceholderRoomOrName: 'Room 101 / Mr. Smith',

      AddTransferLabelVehicleClass: 'Vehicle class',
      AddTransferPlaceholderSelectClass: 'Select class',
      AddTransferLabelVehicle: 'Vehicle',
      AddTransferPlaceholderSelectVehicle: 'Select vehicle',
      AddTransferPlaceholderSelectClassFirst: 'Select class first',

      AddTransferLabelAmountEUR: 'Amount (EUR)',
      AddTransferPlaceholderAmountEUR: '100,00',

      AddTransferLabelPaymentMethod: 'Payment method',
      AddTransferPlaceholderPaymentMethod: 'Select payment method',

      AddTransferButton: 'Add transfer',

      Payment_Cash: 'Cash',
      Payment_Card: 'Card',
      Payment_Voucher: 'Voucher',
      Payment_Invoice: 'Invoice',

      MobileLabel_Customer: 'Customer',
      MobileLabel_Driver: 'Driver',
      MobileLabel_Revenue: 'Revenue',
      MobileLabel_Payment: 'Payment',

      CompleteModalHeading: 'Mark transfer as complete?',
      CompleteModalBody:
        'Are you sure you want to mark this transfer as complete? This action might not be easily reversible.',
      TerminateModalHeading: 'Terminate transfer?',
      TerminateModalBody:
        'Are you sure you want to terminate this transfer? This action is usually final.'
    }
  }
}
