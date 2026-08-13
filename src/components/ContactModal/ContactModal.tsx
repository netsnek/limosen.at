// src/components/ContactModal/ContactModal.tsx
import {
  Button,
  Dialog,
  Field,
  Heading,
  HStack,
  Input,
  Portal,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CheckboxStyled } from './CheckboxStyled'
import { DialogCloseButton } from '../DialogCloseButton'
import { useT } from '../../contexts/language'
import { useIntl } from 'react-intl'

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

  const t = useT()
  const intl = useIntl()

  React.useEffect(() => {
    reset(fixedValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedValues])

  React.useEffect(() => {
    if (!isOpen) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Debug (optional)
  // console.log("Contact", "locale", intl.locale, "messages", intl.messages)

  return (
    <Dialog.Root
      open={isOpen}
      // v2 was `size="2xl"`, and the dialog size names all shifted one step up
      // the sizes scale in v3: the recipe maps xs->sizes.sm, sm->md, md->lg,
      // lg->2xl, xl->4xl. v2's 2xl was maxW 42rem, so `lg` is the size that
      // resolves to the same 42rem v2 painted.
      size="lg"
      preventScroll={false}
      onOpenChange={(e) => {
        if (!e.open) {
          onClose()
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <form
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event)
              }}
            >
              {/* A childless <Dialog.CloseTrigger/> draws no X at all in v3.
                  See DialogCloseButton for what v2 painted here. */}
              <DialogCloseButton />
              <Dialog.Body
                p={{
                  base: 4,
                  md: 8,
                  lg: 12,
                  xl: 16
                }}
              >
                <Stack gap="6">
                  <Heading
                    as="h2"
                    size={{
                      base: 'md',
                      md: 'lg'
                    }}
                  >
                    {t('ContactHeading', 'Contact us')}
                  </Heading>

                  <Text>
                    {t(
                      'ContactIntro',
                      'We look forward to your message and will get back to you shortly.'
                    )}
                  </Text>

                  <HStack>
                    {/* v2's FormLabel drew the red asterisk itself whenever the
                        FormControl was required. v3's Field.Label does not, the
                        indicator is a part of its own, so it is spelled out on
                        every label that had one. */}
                    <Field.Root required invalid={!!errors.firstName}>
                      <Field.Label htmlFor="firstName" fontSize="sm">
                        {t('FirstName', 'First name')}
                        <Field.RequiredIndicator />
                      </Field.Label>
                      {/* `focusBorderColor` is gone in v3 and would be forwarded
                          to the DOM as an unknown attribute. The colour it set is
                          restored as the focused border. */}
                      <Input
                        id="firstName"
                        placeholder={t('FirstName', 'John')}
                        {...register('firstName', { required: true })}
                        disabled={!!fixedValues?.firstName}
                        _focus={{
                          borderColor: 'brand.500'
                        }}
                      />
                      <Field.ErrorText fontSize="sm">
                        {errors.firstName?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root required invalid={!!errors.lastName}>
                      <Field.Label htmlFor="lastName" fontSize="sm">
                        {t('LastName', 'Last name')}
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        id="lastName"
                        placeholder={t('LastName', 'Doe')}
                        {...register('lastName', { required: true })}
                        disabled={!!fixedValues?.lastName}
                        _focus={{
                          borderColor: 'brand.500'
                        }}
                      />
                      <Field.ErrorText fontSize="sm">
                        {errors.lastName?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </HStack>

                  <HStack>
                    <Field.Root required invalid={!!errors.email}>
                      <Field.Label htmlFor="email" fontSize="sm">
                        {t('Email', 'Email')}
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        id="email"
                        placeholder={t('Email', 'john.doe@example.com')}
                        type="email"
                        {...register('email', { required: true })}
                        disabled={!!fixedValues?.email}
                        _focus={{
                          borderColor: 'brand.500'
                        }}
                      />
                      <Field.ErrorText fontSize="sm">
                        {errors.email?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.phone}>
                      <Field.Label htmlFor="phone" fontSize="sm">
                        {t('Phone', 'Phone')}
                      </Field.Label>
                      <Input
                        id="phone"
                        placeholder={t('Phone', '+43 660 000 0000')}
                        type="tel"
                        {...register('phone')}
                        disabled={!!fixedValues?.phone}
                        _focus={{
                          borderColor: 'brand.500'
                        }}
                      />
                      <Field.ErrorText fontSize="sm">
                        {errors.phone?.toString()}
                      </Field.ErrorText>
                    </Field.Root>
                  </HStack>

                  <Field.Root required invalid={!!errors.message}>
                    <Field.Label htmlFor="message" fontSize="sm">
                      {t('HowCanWeHelp', 'How can we help?')}
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Textarea
                      id="message"
                      placeholder={t('MessagePlaceholder', 'Message')}
                      defaultValue={defaultValues?.message}
                      {...register('message', { required: true })}
                      _focus={{
                        borderColor: 'brand.500'
                      }}
                    />
                    <Field.ErrorText fontSize="sm">
                      {errors.message?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root required invalid={!!errors.agreeToTerms}>
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
                            {t(
                              'ConsentText',
                              'You agree that your details may be stored for contacting you and for follow-up questions.'
                            )}
                          </Text>
                        </CheckboxStyled>
                      )}
                      name="agreeToTerms"
                      control={control}
                      rules={{
                        required: t(
                          'ConsentError',
                          'Please confirm the contact permission'
                        )
                      }}
                    />
                    <Field.ErrorText fontSize="sm">
                      {errors.agreeToTerms?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </Stack>
              </Dialog.Body>

              <Dialog.Footer borderTop="1px solid" color="gray.200">
                <Button loading={isSubmitting} type="submit">
                  {t('SendCta', 'Send')}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
