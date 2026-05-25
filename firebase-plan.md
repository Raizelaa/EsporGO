# EsporGO - Gerçek Üyelik İçin Firebase Planı

Bu dosya ikinci aşama içindir. İlk statik MVP ücretsiz hostta yayınlandıktan sonra gerçek kullanıcı sistemi eklemek için kullanılabilir.

## Firebase Koleksiyonları

### users
- uid
- username
- email
- city
- discord
- createdAt

### playerProfiles
- userId
- game
- role
- rank
- activeHours
- bio
- isLookingForTeam

### teams
- ownerId
- teamName
- game
- neededRole
- level
- description
- status

### applications
- teamId
- userId
- message
- status
- createdAt

### tournaments
- title
- game
- date
- prize
- status
- refereeNeeded

## Güvenlik Mantığı

- Her kullanıcı sadece kendi profilini düzenleyebilir.
- Takım sahibi sadece kendi takım ilanını düzenleyebilir.
- Admin rolü olmayan kullanıcı turnuva onaylayamaz.
- Herkese açık alanlarda e-posta gizli tutulmalıdır.

## Neden İlk Aşamada Statik?

Tamamen ücretsiz, hızlı ve gerçek hostta yayınlanabilir. Kullanıcı kitlesi oluşunca veritabanı eklenir.
