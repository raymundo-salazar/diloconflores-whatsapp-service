import { ApiController } from "@controllers/ApiController";
import { ActivityLogs } from "@models/index";

class ActivityLogsController extends ApiController<ActivityLogs> {
  protected model = ActivityLogs;
  protected entity = "activityLogs";
}

export default new ActivityLogsController();
