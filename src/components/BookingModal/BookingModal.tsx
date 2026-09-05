// BookingModal.tsx
import {
  Button,
  Dialog,
  Field,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Portal,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CheckboxStyled } from './CheckboxStyled';
import { DialogCloseButton } from '../DialogCloseButton';
import { useT } from '../../contexts/language';
import { useIntl } from 'react-intl';
import { useFleet } from '../../services/fleet';

export type RideCategory = 'DISTANCE' | 'HOURLY' | 'FLATRATE';
export type RideType = 'ONEWAY' | 'RETURN';
export type PaymentOption = 'CASH' | 'CARD' | 'TRANSFER';

export interface BookingFormValues {
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  flightNumber?: string;
  message: string;

  // Consent
  agreeToTerms: boolean;

  // Ride details
  rideCategory?: RideCategory;
  rideType?: RideType;
  date?: string;
  time?: string;
  pickupAddress?: string;
  destinationAddress?: string;

  passengers?: number;
  luggage?: number;
  childSeats?: number;
  extraTime?: number;

  // Vehicle & Payment (optional)
  carClass?: string;
  carTitle?: string;
  paymentOption?: PaymentOption;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormValues) => Promise<void>;
  fixedValues?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  defaultValues?: {
    message?: string;
  };
}

/**
 * The database class a translated category name stands for. The four classes
 * are fixed by the schema, and matching on the translated word is what lets a
 * German, English, Turkish or Arabic label keep its wording while the list
 * behind it comes from the backend.
 */
const classKeyOf = (category?: string): string | undefined => {
  const c = (category ?? '').toLowerCase();

  if (!c) return undefined;
  if (c.includes('van') || c.includes('bus')) return 'BUSINESS_VAN';
  if (c.includes('elek') || c.includes('electr') || c.includes('elektr')) return 'ELECTRIC_CLASS';
  if (c.includes('first') || c.includes('erste') || c.includes('luxus')) return 'FIRST_CLASS';
  return 'BUSINESS_CLASS';
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fixedValues,
  defaultValues
}) => {
  const t = useT();
  const intl = useIntl();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormValues>({
    defaultValues: {
      rideCategory: 'FLATRATE',
      rideType: 'ONEWAY',
      passengers: undefined,
      luggage: undefined,
      childSeats: undefined,
      extraTime: undefined,
      paymentOption: undefined
    }
  });

  // --- Debug: log all react-intl messages once ---
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[intl.messages]', intl.messages);
  }, [intl]);

  // --- Pull fleet and categories primarily from react-intl, fallback to useT() ---
  const rawFleetFromIntl = (intl.messages as any)?.fleet;
  const rawFleetCategoriesMsg = (intl.messages as any)?.fleetCategories;

  const fleetFromIntl: any[] = React.useMemo(() => {
    if (Array.isArray(rawFleetFromIntl)) return rawFleetFromIntl;
    if (typeof rawFleetFromIntl === 'string') {
      try {
        const parsed = JSON.parse(rawFleetFromIntl);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore invalid JSON
      }
    }
    return [];
  }, [rawFleetFromIntl]);

  const fleetCategoriesFromIntl: string[] = React.useMemo(() => {
    if (Array.isArray(rawFleetCategoriesMsg)) {
      return rawFleetCategoriesMsg.filter(Boolean);
    }
    if (typeof rawFleetCategoriesMsg === 'string') {
      try {
        const parsed = JSON.parse(rawFleetCategoriesMsg);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        return rawFleetCategoriesMsg
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
    }
    if (fleetFromIntl.length) {
      return Array.from(
        new Set(fleetFromIntl.map((v: any) => v?.category).filter(Boolean))
      );
    }
    return [];
  }, [rawFleetCategoriesMsg, fleetFromIntl]);

  /**
   * The backend's fleet wins over the translated list, but only when it has
   * something to say.
   *
   * The translations carry a vehicle list per language, which has to be edited
   * four times and drifts from the cars the company actually runs. `fleet` is
   * the same data the dispatch app sees, minus the plates and the driver
   * assignment, so the form offers what exists. The translated list stays as
   * the fallback in two cases: while the backend has not answered or cannot be
   * reached, and when it answers an empty list. The second case is this brand's
   * state today, its Car table holds no rows, and a form with no class to pick
   * would turn every visitor away. The labels for the classes always come from
   * the translations.
   */
  const fleetFromApi = useFleet();
  const fleetFromApiIsUsable = !!fleetFromApi?.length;

  const fleetData: any[] = React.useMemo(() => {
    const translated = fleetFromIntl.length
      ? fleetFromIntl
      : ((t as any).fleet ?? []);

    if (!fleetFromApi?.length) return translated;

    return fleetFromApi.map(entry => {
      // The class name a visitor reads stays translated: the API answers with
      // BUSINESS_VAN, which is a database value and not a label.
      const label =
        (translated as any[]).find(
          (v: any) => classKeyOf(v?.category) === entry.carClass
        )?.category ?? entry.carClass;

      return {
        category: label,
        description: entry.models.join(', ')
      };
    });
  }, [fleetFromApi, fleetFromIntl, t]);

  // The class dropdown must list exactly the classes the vehicle dropdown can
  // fill. With the backend's fleet in use, that is what the fleet contains, in
  // the order the translations put the classes in; with the translated
  // fallback, it is the translated category list itself.
  const fleetCategories: string[] = React.useMemo(() => {
    const fromData = Array.from(
      new Set(
        (Array.isArray(fleetData) ? fleetData : [])
          .map((v: any) => v?.category)
          .filter(Boolean)
      )
    ) as string[];

    if (!fleetFromApiIsUsable) {
      return fleetCategoriesFromIntl.length ? fleetCategoriesFromIntl : fromData;
    }

    const rank = (cat: string) => {
      const i = fleetCategoriesFromIntl.indexOf(cat);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };

    return [...fromData].sort((a, b) => rank(a) - rank(b));
  }, [fleetData, fleetFromApiIsUsable, fleetCategoriesFromIntl]);

  // Build vehicle names per category from comma-separated description
  const vehiclesByCategory: Record<string, string[]> = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    (fleetData as any[]).forEach((item: any) => {
      const cat = item?.category;
      if (!cat) return;
      const desc: string = item?.description || '';
      const models =
        desc
          .split(',')
          .map(s => s.trim())
          .filter(Boolean) || [];
      const list = models.length > 0 ? models : item?.name ? [item.name] : [];
      if (!map[cat]) map[cat] = [];
      list.forEach(m => {
        if (!map[cat].includes(m)) map[cat].push(m);
      });
    });
    return map;
  }, [fleetData]);

  const selectedCarClass = watch('carClass');
  const vehicleOptions = selectedCarClass
    ? vehiclesByCategory[selectedCarClass] ?? []
    : [];

  React.useEffect(() => {
    reset({
      ...fixedValues,
      message: defaultValues?.message
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedValues, defaultValues]);

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    // Clear vehicle selection when class changes
    setValue('carTitle', undefined);
  }, [selectedCarClass, setValue]);

  return (
    <Dialog.Root
      open={isOpen}
      // v2 was `size="3xl"`, i.e. maxW 3xl (48rem). v3's dialog sizes step
      // straight from lg (maxW 2xl, 42rem) to xl (maxW 4xl, 56rem), so no size
      // name paints 48rem any more. The nearest smaller step is taken and the
      // width is pinned back on the content below, which is the only thing the
      // size variant sets.
      size="lg"
      preventScroll={false}
      onOpenChange={e => {
        if (!e.open) {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="3xl">
            <form
              onSubmit={event => {
                void handleSubmit(onSubmit)(event);
              }}
            >
              {/* A childless <Dialog.CloseTrigger/> draws no X at all in v3.
                  See DialogCloseButton for what v2 painted here. */}
              <DialogCloseButton />
              <Dialog.Body
                p={{
                  base: 4,
                  md: 8,
                  lg: 10
                }}
              >
                <Stack gap={8}>
                  <Stack gap={2}>
                    <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
                      {t('BookingHeading', 'Booking request')}
                    </Heading>
                    <Text color="black">
                      {t(
                        'BookingIntro',
                        'Please fill in your ride details and contact info. We’ll get back to you shortly.'
                      )}
                    </Text>
                  </Stack>

                  {/* Ride details */}
                  <Stack gap={4}>
                    <Heading as="h3" size="sm">
                      {t('SectionRide', 'Ride')}
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <Field.Root>
                        <Field.Label fontSize="sm">
                          {t('LabelCategory', 'Category')}
                        </Field.Label>
                        {/* v2's `<Select>` was a native select with a chevron
                            drawn by the theme. v3 splits that into NativeSelect's
                            three parts: the root positions, the field is the
                            `<select>` and the indicator is the chevron. The
                            plain `Select` namespace in v3 is the JS listbox, not
                            this. */}
                        <NativeSelect.Root>
                          {/* `focusBorderColor` is gone in v3 and would be
                              forwarded to the DOM as an unknown attribute. The
                              colour it set is restored as the focused border. */}
                          <NativeSelect.Field
                            {...register('rideCategory')}
                            _focus={{ borderColor: 'brand.500' }}
                          >
                            <option value="DISTANCE">
                              {t('CategoryDistance', 'Distance')}
                            </option>
                            <option value="HOURLY">
                              {t('CategoryHourly', 'Hourly')}
                            </option>
                            <option value="FLATRATE">
                              {t('CategoryFlatrate', 'Flat rate')}
                            </option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label fontSize="sm">
                          {t('LabelType', 'Type')}
                        </Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            {...register('rideType')}
                            _focus={{ borderColor: 'brand.500' }}
                          >
                            <option value="ONEWAY">
                              {t('TypeOneWay', 'One-way')}
                            </option>
                            <option value="RETURN">
                              {t('TypeReturn', 'Return')}
                            </option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="date" fontSize="sm">
                          {t('LabelDate', 'Date')}
                        </Field.Label>
                        <Input
                          id="date"
                          type="date"
                          {...register('date')}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.date?.toString()}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="time" fontSize="sm">
                          {t('LabelTime', 'Pickup time')}
                        </Field.Label>
                        <Input
                          id="time"
                          type="time"
                          {...register('time')}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.time?.toString()}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="pickupAddress" fontSize="sm">
                          {t('LabelPickup', 'Pickup address')}
                        </Field.Label>
                        <Input
                          id="pickupAddress"
                          placeholder={t('LabelPickup', 'Pickup address')}
                          {...register('pickupAddress')}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="destinationAddress" fontSize="sm">
                          {t('LabelDestination', 'Destination address')}
                        </Field.Label>
                        <Input
                          id="destinationAddress"
                          placeholder={t(
                            'LabelDestination',
                            'Destination address'
                          )}
                          {...register('destinationAddress')}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="passengers" fontSize="sm">
                          {t('LabelPassengers', 'Passengers')}
                        </Field.Label>
                        <Input
                          id="passengers"
                          type="number"
                          min={1}
                          {...register('passengers', { valueAsNumber: true })}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="luggage" fontSize="sm">
                          {t('LabelLuggage', 'Luggage')}
                        </Field.Label>
                        <Input
                          id="luggage"
                          type="number"
                          min={0}
                          {...register('luggage', { valueAsNumber: true })}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="childSeats" fontSize="sm">
                          {t('LabelChildSeats', 'Child seat')}
                        </Field.Label>
                        <Input
                          id="childSeats"
                          type="number"
                          min={0}
                          {...register('childSeats', { valueAsNumber: true })}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label htmlFor="extraTime" fontSize="sm">
                          {t('LabelExtraTime', 'Extra time (hrs)')}
                        </Field.Label>
                        <Input
                          id="extraTime"
                          type="number"
                          min={0}
                          max={12}
                          {...register('extraTime', { valueAsNumber: true })}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                      </Field.Root>
                    </SimpleGrid>

                    {/* v2's Divider drew a 1px line in the INHERITED colour at
                        0.6 opacity. v3's Separator paints the `border` token
                        instead, so both values are pinned back to keep the same
                        grey. */}
                    <Separator borderColor="inherit" opacity={0.6} />

                    {/* Vehicle & Payment */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      <Field.Root>
                        <Field.Label fontSize="sm">
                          {t('LabelCarClass', 'Vehicle class')}
                        </Field.Label>
                        <NativeSelect.Root>
                          {/* NativeSelect.Field renders the placeholder as a
                              leading empty option, the same markup v2's Select
                              built from the prop. */}
                          <NativeSelect.Field
                            placeholder={t('SelectCarClass', 'Select a class')}
                            {...register('carClass')}
                            _focus={{ borderColor: 'brand.500' }}
                          >
                            {fleetCategories.map(cat => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>

                      <Field.Root disabled={!selectedCarClass}>
                        <Field.Label fontSize="sm">
                          {t('LabelCarTitle', 'Vehicle')}
                        </Field.Label>
                        {/* NativeSelect.Root reads `disabled` off the enclosing
                            field and hands it to the select, which is how v2's
                            FormControl isDisabled reached it. */}
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            placeholder={
                              selectedCarClass
                                ? t('SelectVehicle', 'Select a vehicle')
                                : t('SelectClassFirst', 'Select a class first')
                            }
                            {...register('carTitle')}
                            _focus={{ borderColor: 'brand.500' }}
                          >
                            {vehicleOptions.map(model => (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label fontSize="sm">
                          {t('LabelPaymentOption', 'Payment option')}
                        </Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            {...register('paymentOption')}
                            _focus={{ borderColor: 'brand.500' }}
                          >
                            <option value="CASH">
                              {t('PaymentCash', 'Cash')}
                            </option>
                            <option value="CARD">
                              {t('PaymentCard', 'Card')}
                            </option>
                            <option value="TRANSFER">
                              {t('PaymentTransfer', 'Überweisung')}
                            </option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    </SimpleGrid>
                  </Stack>

                  {/* Contact details */}
                  <Stack gap={4}>
                    <Heading as="h3" size="sm">
                      {t('SectionContact', 'Contact details')}
                    </Heading>

                    <HStack>
                      {/* v2's FormLabel drew the red asterisk itself whenever the
                          FormControl was required. v3's Field.Label does not, the
                          indicator is a part of its own, so it is spelled out on
                          every label that had one. */}
                      <Field.Root required invalid={!!errors.firstName}>
                        <Field.Label htmlFor="firstName" fontSize="sm">
                          {t('LabelFirstName', 'First name')}
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          id="firstName"
                          placeholder={t('LabelFirstName', 'First name')}
                          {...register('firstName', { required: true })}
                          disabled={!!fixedValues?.firstName}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.firstName?.message}
                        </Field.ErrorText>
                      </Field.Root>
                      <Field.Root required invalid={!!errors.lastName}>
                        <Field.Label htmlFor="lastName" fontSize="sm">
                          {t('LabelLastName', 'Last name')}
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          id="lastName"
                          placeholder={t('LabelLastName', 'Last name')}
                          {...register('lastName', { required: true })}
                          disabled={!!fixedValues?.lastName}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.lastName?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </HStack>

                    <HStack>
                      <Field.Root required invalid={!!errors.email}>
                        <Field.Label htmlFor="email" fontSize="sm">
                          {t('LabelEmail', 'Email')}
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          id="email"
                          placeholder="john.doe@example.com"
                          type="email"
                          {...register('email', { required: true })}
                          disabled={!!fixedValues?.email}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.email?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.phone}>
                        <Field.Label htmlFor="phone" fontSize="sm">
                          {t('LabelPhone', 'Phone')}
                        </Field.Label>
                        <Input
                          id="phone"
                          placeholder="+43 660 000 0000"
                          type="tel"
                          {...register('phone')}
                          disabled={!!fixedValues?.phone}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.phone?.toString()}
                        </Field.ErrorText>
                      </Field.Root>
                    </HStack>

                    <HStack>
                      <Field.Root invalid={!!errors.flightNumber}>
                        <Field.Label htmlFor="flightNumber" fontSize="sm">
                          {t('LabelFlightNumber', 'Flight number')}
                        </Field.Label>
                        <Input
                          id="flightNumber"
                          placeholder="e.g. OS123"
                          {...register('flightNumber')}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        <Field.ErrorText fontSize="sm">
                          {errors.flightNumber?.toString()}
                        </Field.ErrorText>
                      </Field.Root>
                    </HStack>

                    <Field.Root required invalid={!!errors.message}>
                      <Field.Label htmlFor="message" fontSize="sm">
                        {t('LabelWishes', 'Wishes')}
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Textarea
                        id="message"
                        placeholder={t('WishesPlaceholder', 'Wishes or note')}
                        defaultValue={defaultValues?.message}
                        {...register('message', { required: true })}
                        _focus={{ borderColor: 'brand.500' }}
                      />
                      <Field.ErrorText fontSize="sm">
                        {errors.message?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root required invalid={!!errors.agreeToTerms}>
                      <Controller
                        name="agreeToTerms"
                        control={control}
                        rules={{
                          required: t(
                            'ConsentError',
                            'Please confirm the contact permission'
                          )
                        }}
                        render={({ field }) => (
                          <CheckboxStyled
                            ref={field.ref}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            checked={field.value}
                            roundedFull
                          >
                            <Text
                              color="black"
                              fontSize={{ base: 'xs', md: 'sm' }}
                            >
                              {t(
                                'ConsentText',
                                'I agree that my details may be stored for contacting me and for follow-up questions.'
                              )}
                            </Text>
                          </CheckboxStyled>
                        )}
                      />
                      <Field.ErrorText fontSize="sm">
                        {errors.agreeToTerms?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </Stack>
                </Stack>
              </Dialog.Body>

              <Dialog.Footer borderTop="1px solid" color="gray.2 00">
                <Button loading={isSubmitting} type="submit">
                  {t('SubmitCta', 'Reserve')}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
