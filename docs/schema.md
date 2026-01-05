# Gabojago DB Schema

## 1. Users (사용자)

| Column            | Type   | Description                     |
| :---------------- | :----- | :------------------------------ |
| `id`              | Bigint | PK                              |
| `email`           | String | 이메일 (ID)                     |
| `password_digest` | String | 암호화된 비밀번호               |
| `nickname`        | String | 닉네임                          |
| `role`            | String | role (`user`, `admin`, `staff`) |
| `social_provider` | String | 소셜제공자 (kakao, naver)       |
| `social_uid`      | String | 소셜 UID                        |

## 2. Events (축제 & 공모전)

| Column            | Type    | Description                                                      |
| :---------------- | :------ | :--------------------------------------------------------------- |
| `id`              | Bigint  | PK                                                               |
| `title`           | String  | 행사명                                                           |
| `description`     | Text    | 상세설명                                                         |
| `start_date`      | Date    | 시작일                                                           |
| `end_date`        | Date    | 종료일                                                           |
| `address`         | String  | 주소                                                             |
| `location`        | Point   | 좌표 (위도, 경도) - PostGIS or simple float                      |
| `main_image_url`  | String  | 대표 이미지                                                      |
| `event_type`      | Integer | Enum (0:festival, 1:exhibition, 2:fair, 3:experience, 4:contest) |
| `status`          | String  | status (upcoming, ongoing, ended)                                |
| `stamp_image_url` | String  | 스탬프 이미지 URL                                                |
| `original_link`   | String  | 크롤링 원본 링크                                                 |

## 3. Tickets (티켓/여권)

| Column        | Type     | Description                   |
| :------------ | :------- | :---------------------------- |
| `id`          | Bigint   | PK                            |
| `user_id`     | FK       | 사용자                        |
| `event_id`    | FK       | 행사                          |
| `qr_code`     | String   | 고유 QR 코드                  |
| `status`      | String   | status (`issued`, `verified`) |
| `verified_at` | Datetime | 인증(스탬프) 시간             |

## 4. Products (굿즈)

| Column      | Type    | Description           |
| :---------- | :------ | :-------------------- |
| `id`        | Bigint  | PK                    |
| `event_id`  | FK      | 관련 행사 (Null 허용) |
| `name`      | String  | 상품명                |
| `price`     | Integer | 가격                  |
| `stock`     | Integer | 재고                  |
| `is_hot`    | Boolean | 인기상품 여부         |
| `image_url` | String  | 상품 이미지           |

## 5. Orders (주문)

| Column        | Type    | Description |
| :------------ | :------ | :---------- |
| `id`          | Bigint  | PK          |
| `user_id`     | FK      | 주문자      |
| `total_price` | Integer | 총액        |
| `status`      | String  | 상태        |

## 6. OrderItems (주문상세)

| Column       | Type    | Description |
| :----------- | :------ | :---------- |
| `order_id`   | FK      | 주문        |
| `product_id` | FK      | 상품        |
| `quantity`   | Integer | 수량        |

## 7. Comments (커뮤니티)

| Column     | Type   | Description             |
| :--------- | :----- | :---------------------- |
| `id`       | Bigint | PK                      |
| `user_id`  | FK     | 작성자                  |
| `event_id` | FK     | 행사                    |
| `content`  | Text   | 내용                    |
| `kind`     | String | type (`cheer`, `reply`) |

## 8. Categories (지역/장르)

| Column  | Type   | Description          |
| :------ | :----- | :------------------- |
| `id`    | Bigint | PK                   |
| `name`  | String | 이름 (서울, 뮤직...) |
| `group` | String | 그룹 (region, genre) |
