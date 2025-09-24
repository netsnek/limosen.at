import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  Select,
  SimpleGrid,
  Divider
} from '@chakra-ui/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CheckboxStyled } from './CheckboxStyled'

export type RideCategory = 'DISTANCE' | 'HOURLY' | 'FLATRATE'
export type RideType = 'ONEWAY' | 'RETURN'

export interface ContactFormValues {
  // Kontakt
  firstName: string
  lastName: string
  email: string
  phone?: string
  flightNumber?: string
  message: string

  // Zustimmung
  agreeToTerms: boolean

  // Fahrt-Details
  rideCategory?: RideCategory           // Distanz | Stündlich | Flatrate
  rideType?: RideType                   // Einweg | Rückkehr
  date?: string                         // YYYY-MM-DD
  time?: string                         // HH:MM
  pickupAddress?: string
  destinationAddress?: string

  passengers?: number                   // Passagieranzahl
  luggage?: number                      // Gepäckanzahl
  childSeats?: number                   // Kindersitz
  extraTime?: number                    // Zusätzliche Zeit (0-12)

  // Fahrzeug/Preis (optional – falls du sie befüllen möchtest)
  carClass?: string                     // z.B. Business Class / First Class
  carTitle?: string                     // z.B. Mercedes-Benz E Klasse
  price?: number                        // z.B. 10.00
}

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContactFormValues) => Promise<void>
  fixedValues?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  defaultValues?: {
    message?: string
  }
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fixedValues,
  defaultValues
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    defaultValues: {
      rideCategory: 'FLATRATE',
      rideType: 'ONEWAY',
      passengers: undefined,
      luggage: undefined,
      childSeats: undefined,
      extraTime: undefined
    }
  })

  React.useEffect(() => {
    // fixedValues (Kontakt) und optionale Defaults (Message) übernehmen
    reset({
      ...fixedValues,
      message: defaultValues?.message
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedValues, defaultValues])

  React.useEffect(() => {
    if (!isOpen) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
        >
          <ModalCloseButton />
          <ModalBody
            p={{
              base: 4,
              md: 8,
              lg: 10,
            }}
          >
            <Stack spacing={8}>
              <Stack spacing={2}>
                <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
                  Reservierungsanfrage
                </Heading>
                <Text>
                  Bitte fülle die Fahrtdetails und deine Kontaktdaten aus. Wir melden uns schnellstmöglich.
                </Text>
              </Stack>

              {/* Fahrt-Details */}
              <Stack spacing={4}>
                <Heading as="h3" size="sm">
                  Fahrt
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Kategorie</FormLabel>
                    <Select
                      {...register('rideCategory')}
                      focusBorderColor="brand.500"
                    >
                      <option value="DISTANCE">Distanz</option>
                      <option value="HOURLY">Stündlich</option>
                      <option value="FLATRATE">Flatrate</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Art</FormLabel>
                    <Select
                      {...register('rideType')}
                      focusBorderColor="brand.500"
                    >
                      <option value="ONEWAY">Einweg</option>
                      <option value="RETURN">Rückkehr</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="date" fontSize="sm">Datum</FormLabel>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.date?.toString()}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="time" fontSize="sm">Abholzeit</FormLabel>
                    <Input
                      id="time"
                      type="time"
                      {...register('time')}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.time?.toString()}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="pickupAddress" fontSize="sm">Abholadresse</FormLabel>
                    <Input
                      id="pickupAddress"
                      placeholder="Abholadresse"
                      {...register('pickupAddress')}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="destinationAddress" fontSize="sm">Zieladresse</FormLabel>
                    <Input
                      id="destinationAddress"
                      placeholder="Zieladresse"
                      {...register('destinationAddress')}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="passengers" fontSize="sm">Passagieranzahl</FormLabel>
                    <Input
                      id="passengers"
                      type="number"
                      min={1}
                      {...register('passengers', { valueAsNumber: true })}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="luggage" fontSize="sm">Gepäckanzahl</FormLabel>
                    <Input
                      id="luggage"
                      type="number"
                      min={0}
                      {...register('luggage', { valueAsNumber: true })}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="childSeats" fontSize="sm">Kindersitz</FormLabel>
                    <Input
                      id="childSeats"
                      type="number"
                      min={0}
                      {...register('childSeats', { valueAsNumber: true })}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="extraTime" fontSize="sm">Zusätzliche Zeit (Std.)</FormLabel>
                    <Input
                      id="extraTime"
                      type="number"
                      min={0}
                      max={12}
                      {...register('extraTime', { valueAsNumber: true })}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>
                </SimpleGrid>

                <Divider />

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Fahrzeugklasse</FormLabel>
                    <Input
                      placeholder="z. B. Business Class"
                      {...register('carClass')}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Fahrzeug</FormLabel>
                    <Input
                      placeholder="z. B. Mercedes-Benz E Klasse"
                      {...register('carTitle')}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Preis (€)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="z. B. 10.00"
                      {...register('price', { valueAsNumber: true })}
                      focusBorderColor="brand.500"
                    />
                  </FormControl>
                </SimpleGrid>
              </Stack>

              {/* Kontaktdaten */}
              <Stack spacing={4}>
                <Heading as="h3" size="sm">
                  Kontaktdetails
                </Heading>

                <HStack>
                  <FormControl isRequired isInvalid={!!errors.firstName}>
                    <FormLabel htmlFor="firstName" fontSize="sm">
                      Passagier Vorname*
                    </FormLabel>
                    <Input
                      id="firstName"
                      placeholder="Max"
                      {...register('firstName', { required: true })}
                      isDisabled={!!fixedValues?.firstName}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.firstName?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.lastName}>
                    <FormLabel htmlFor="lastName" fontSize="sm">
                      Passagier Nachname*
                    </FormLabel>
                    <Input
                      id="lastName"
                      placeholder="Mustermann"
                      {...register('lastName', { required: true })}
                      isDisabled={!!fixedValues?.lastName}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.lastName?.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>

                <HStack>
                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email" fontSize="sm">
                      E-Mail*
                    </FormLabel>
                    <Input
                      id="email"
                      placeholder="max.mustermann@example.com"
                      type="email"
                      {...register('email', { required: true })}
                      isDisabled={!!fixedValues?.email}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.email?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel htmlFor="phone" fontSize="sm">
                      Telefon*
                    </FormLabel>
                    <Input
                      id="phone"
                      placeholder="+43 660 000 0000"
                      type="tel"
                      {...register('phone')}
                      isDisabled={!!fixedValues?.phone}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.phone?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>

                <HStack>
                  <FormControl isInvalid={!!errors.flightNumber}>
                    <FormLabel htmlFor="flightNumber" fontSize="sm">
                      Flugnummer
                    </FormLabel>
                    <Input
                      id="flightNumber"
                      placeholder="z. B. OS123"
                      {...register('flightNumber')}
                      focusBorderColor="brand.500"
                    />
                    <FormErrorMessage fontSize="sm">
                      {errors.flightNumber?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>

                <FormControl isRequired isInvalid={!!errors.message}>
                  <FormLabel htmlFor="message" fontSize="sm">
                    Wünsche
                  </FormLabel>
                  <Textarea
                    id="message"
                    placeholder="Wünsche oder Hinweise"
                    defaultValue={defaultValues?.message}
                    {...register('message', { required: true })}
                    focusBorderColor="brand.500"
                  />
                  <FormErrorMessage fontSize="sm">
                    {errors.message?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.agreeToTerms}>
                  <Controller
                    render={({ field }) => (
                      <CheckboxStyled
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        checked={field.value}
                        roundedFull
                      >
                        <Text
                          fontSize={{
                            base: 'xs',
                            md: 'sm'
                          }}
                        >
                          Ich bin damit einverstanden, dass meine Angaben zur
                          Kontaktaufnahme und für Rückfragen gespeichert werden.
                        </Text>
                      </CheckboxStyled>
                    )}
                    name="agreeToTerms"
                    control={control}
                    rules={{
                      required:
                        'Bitte bestätige die Bedingungen zur Kontaktaufnahme'
                    }}
                  />
                  <FormErrorMessage fontSize="sm">
                    {errors.agreeToTerms?.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" color="gray.200">
            <Button isLoading={isSubmitting} type="submit">
              Reservieren
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
