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
  Textarea
} from '@chakra-ui/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CheckboxStyled } from './CheckboxStyled'

export interface ContactFormValues {
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string

  agreeToTerms: boolean
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
  } = useForm<ContactFormValues>({})

  React.useEffect(() => {
    reset(fixedValues)
  }, [fixedValues])

  React.useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
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
              lg: 12,
              xl: 16
            }}
          >
            <Stack spacing="6">
              <Heading
                as="h2"
                size={{
                  base: 'md',
                  md: 'lg'
                }}
              >
                Kontaktieren Sie uns
              </Heading>

              <Text size="b2015">
                Wir freuen uns über Ihre Nachricht und melden uns
                schnellstmöglich bei Ihnen.
              </Text>

              <HStack>
                <FormControl isRequired isInvalid={!!errors.firstName}>
                  <FormLabel htmlFor="firstName" fontSize="sm">
                    Vorname
                  </FormLabel>
                  <Input
                    id="firstName"
                    placeholder="Max"
                    {...register('firstName', {
                      required: true
                    })}
                    isDisabled={!!fixedValues?.firstName}
                    focusBorderColor="brand.500"
                    _focus={{
                      borderColor: 'brand.500'
                    }}
                  />

                  <FormErrorMessage fontSize="sm">
                    {errors.firstName?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.lastName}>
                  <FormLabel htmlFor="lastName" fontSize="sm">
                    Nachname
                  </FormLabel>
                  <Input
                    id="lastName"
                    placeholder="Mustermann"
                    {...register('lastName', {
                      required: true
                    })}
                    isDisabled={!!fixedValues?.lastName}
                    focusBorderColor="brand.500"
                    _focus={{
                      borderColor: 'brand.500'
                    }}
                  />

                  <FormErrorMessage fontSize="sm">
                    {errors.lastName?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack>
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email" fontSize="sm">
                    E-Mail
                  </FormLabel>
                  <Input
                    id="email"
                    placeholder="max.mustermann@example.com"
                    type="email"
                    {...register('email', {
                      required: true
                    })}
                    isDisabled={!!fixedValues?.email}
                    focusBorderColor="brand.500"
                    _focus={{
                      borderColor: 'brand.500'
                    }}
                  />

                  <FormErrorMessage fontSize="sm">
                    {errors.email?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="phone" fontSize="sm">
                    Telefonnummer
                  </FormLabel>
                  <Input
                    id="phone"
                    placeholder="+43 123 456 789"
                    type="phone"
                    {...register('phone', {
                      required: false
                    })}
                    isDisabled={!!fixedValues?.phone}
                    focusBorderColor="brand.500"
                    _focus={{
                      borderColor: 'brand.500'
                    }}
                  />

                  <FormErrorMessage fontSize="sm">
                    {errors.email?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl isRequired isInvalid={!!errors.message}>
                <FormLabel htmlFor="message" fontSize="sm">
                  Wie können wir Ihnen helfen?
                </FormLabel>
                <Textarea
                  id="message"
                  placeholder="Nachricht"
                  defaultValue={defaultValues?.message}
                  {...register('message', { required: true })}
                  focusBorderColor="brand.500"
                  _focus={{
                    borderColor: 'brand.500'
                  }}
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
                        Sie willigen ein, dass Ihre Angaben zur
                        Kontaktaufnahme und für Rückfragen gespeichert werden.
                      </Text>
                    </CheckboxStyled>
                  )}
                  name="agreeToTerms"
                  control={control}
                  rules={{
                    required:
                      'Bitte bestätigen Sie die Bedingungen zur Kontaktaufnahme'
                  }}
                />
                <FormErrorMessage fontSize="sm">
                  {errors.agreeToTerms?.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" color="gray.200">
            <Button
              isLoading={isSubmitting}
              type="submit"
            >
              Senden
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
