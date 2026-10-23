import { InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material'
import { defaultCountries, FlagImage, parseCountry, usePhoneInput } from 'react-international-phone'

type PhoneFieldProps = {
  label: string
  // Valor en E.164 (+584121234567); '' cuando está vacío.
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: boolean
  helperText?: string
  // País inicial del selector (ISO2). Por defecto, Venezuela.
  defaultCountry?: string
}

// Teléfono internacional: selector de país con bandera + número con formato.
export function PhoneField({ label, value, onChange, onBlur, error, helperText, defaultCountry = 've' }: PhoneFieldProps) {
  const { inputValue, country, setCountry, handlePhoneValueChange, inputRef } = usePhoneInput({
    defaultCountry,
    value,
    countries: defaultCountries,
    forceDialCode: true,
    onChange: (data) => {
      // Solo el código de país (+58) cuenta como vacío.
      const digits = data.phone.replace(/\D/g, '')
      onChange(digits === data.country.dialCode ? '' : data.phone)
    },
  })

  return (
    <TextField
      label={label}
      value={inputValue}
      onChange={handlePhoneValueChange}
      onBlur={onBlur}
      inputRef={inputRef}
      type="tel"
      error={error}
      helperText={helperText}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0.5 }}>
              <Select
                variant="standard"
                disableUnderline
                value={country.iso2}
                onChange={(event) => setCountry(event.target.value)}
                renderValue={(iso2) => <FlagImage iso2={iso2} size="20px" style={{ display: 'block' }} />}
                MenuProps={{ slotProps: { paper: { sx: { maxHeight: 320 } } } }}
                aria-label="País del teléfono"
              >
                {defaultCountries.map((item) => {
                  const parsed = parseCountry(item)
                  return (
                    <MenuItem key={parsed.iso2} value={parsed.iso2}>
                      <FlagImage iso2={parsed.iso2} size="20px" style={{ marginRight: 8 }} />
                      <Typography sx={{ fontSize: '13px' }}>
                        {parsed.name} <span style={{ opacity: 0.6 }}>+{parsed.dialCode}</span>
                      </Typography>
                    </MenuItem>
                  )
                })}
              </Select>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
