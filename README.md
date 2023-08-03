# EpWorld API

> 앗 파링을(를) 낚았다!

- 기획·개발·디자인: 키뮤 (@Kimu-Latilus)

### TypeORM 마이그레이션

```shell
yarn build
yarn typeorm migration:generate src/migrations/init -d datasource.js
yarn build
yarn typeorm migration:run -d datasource.js
```

- 디버깅 시 db 열기

```shell
docker-compose -f docker-compose.dev.yml up -d --build
```


## 게임 시스템
### 