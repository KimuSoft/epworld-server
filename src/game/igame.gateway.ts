import { Controller, Get, NotImplementedException, Post } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { JoinPlaceDto } from "./dto/join-place.dto"
import { SendMessageDto } from "./dto/send-message.dto"
import { PlaceDto } from "../places/dto/place.dto"
import { UserDto } from "../users/dto/user.dto"
import { GameResultDto } from "./dto/game-result.dto"
import { GameEventDto } from "./dto/game-event.dto"

// 스웨거 타입 생성용 컨트롤러입니다.
// 이 컨트롤러는 Socket 사양 설명 용으로 실제로 사용되지 않습니다.
// 이 컨트롤러에 있는 API는 스웨거 문서에만 표시되며, 동작하지 않습니다.

// socket 사양을 설명하기 위해 REST Method를 사용합니다.
// Get: Emit (서버 -> 클라이언트)
// Post: Subscribe (클라이언트 -> 서버)

@ApiTags("Game (Socket API)")
@Controller("socket")
export class IGameGateway {
  @ApiOperation({ summary: "낚시터에 들어가기" })
  @ApiBody({ type: JoinPlaceDto })
  @Post("join")
  join() {
    throw new NotImplementedException()
  }

  /* 채팅 이벤트 */

  @ApiOperation({ summary: "채팅 보내기" })
  @Post("message[:]send")
  @ApiBody({ type: SendMessageDto })
  sendMessage() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "채팅 이벤트" })
  @Get("message[:]on")
  @ApiBody({ type: SendMessageDto })
  onMessage() {
    throw new NotImplementedException()
  }

  /* 게임 이벤트 */

  @ApiOperation({ summary: "낚시 게임 시작 요청" })
  @Post("game[:]start")
  gameStart() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "낚시 게임 시작 이벤트" })
  @Get("game[:]start")
  gameStarted() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "낚시대 당기기 요청" })
  @Post("game[:]catch")
  catchFish() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "낚시 중 이벤트 발생 (턴 진행)" })
  @ApiBody({ type: GameEventDto })
  @Get("game[:]event")
  gameEvent() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "낚시 종료 및 결과 보고 이벤트" })
  @ApiBody({ type: GameResultDto })
  @Get("game[:]end")
  gameEnded() {
    throw new NotImplementedException()
  }

  /* 정보 갱신 */

  @ApiOperation({ summary: "전체 정보 갱신 요청" })
  @Post("refresh")
  refresh() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "낚시터 정보 갱신 요청" })
  @Post("refresh[:]place")
  refreshPlace() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "낚시터 정보 갱신 이벤트" })
  @ApiBody({ type: PlaceDto })
  @Get("refresh[:]place")
  placeUpdated() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "유저 정보 갱신 요청" })
  @Post("refresh[:]user")
  userUpdate() {
    throw new NotImplementedException()
  }

  @ApiOperation({ summary: "유저 정보 갱신 이벤트" })
  @ApiBody({ type: UserDto })
  @Get("refresh[:]user")
  userUpdated() {
    throw new NotImplementedException()
  }

  /* 핑 확인 */

  @ApiOperation({ summary: "핑 확인 요청" })
  @Post("ping")
  ping() {
    throw new NotImplementedException()
  }

  /* 오류 이벤트 */

  @ApiOperation({ summary: "오류 발생 시 이벤트 (게임 오류 제외)" })
  @Get("error")
  socketError() {
    throw new NotImplementedException()
  }
}
