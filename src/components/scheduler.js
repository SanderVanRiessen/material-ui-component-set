(() => ({
  name: 'Scheduler',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { Box, Grid } = window.MaterialUI.Core;
    const { EditingState, ViewState } = window.MaterialUI.Scheduler;
    const {
      Scheduler,
      DayView,
      Appointments,
      Toolbar,
      WeekView,
      ViewSwitcher,
      DateNavigator,
      DragDropProvider,
      TodayButton,
      AppointmentTooltip,
      AppointmentForm,
      EditRecurrenceMenu,
      ConfirmationDialog,
      CurrentTimeIndicator,
    } = window.MaterialUI.MUIScheduler;
    const { add: addToDate, sub: subFromDate } = window.MaterialUI;
    const {
      Person,
      Note,
      AirplanemodeActive,
      Check,
      Close,
      Title,
      People,
    } = window.MaterialUI.Icons;
    const { useText, useAction, useAllQuery } = B;
    const isDev = B.env === 'dev';
    const {
      eventModel,
      actionId,
      showCustomForm,
      showWebuser,
      colorBusiness,
      colorPrivate,
      useEventColor,
      defaultTitle,
      startTime,
      endTime,
      disabledPast,
      dynamicWebuserId,
      enableTooltip,
      enableForm,
    } = options;

    const translationMap = {
      nl: 'NL',
      en: 'EN',
    };

    const localeMap = {
      nl: 'nl-NL',
      en: 'en-EN',
    };
    const locale = 'nl';
    const colors = {
      Default: '#20659A',
      Business: colorBusiness,
      Private: colorPrivate,
    };
    const localeTranslation = translationMap[locale];
    const { scheduler: schedulerTranslation } = window.MaterialUI.Translations[
      localeTranslation
    ];
    const now = new Date();
    const dynamicWebuserIdTExt = useText(dynamicWebuserId);

    const intialCurrentDate = now;

    // useMinMonth necesary for 0 values that are auto treated as null in prefab
    // calculatedMindate holds the current date and time when the "Disable past" checkbox is checked
    const calculatedMindate = disabledPast ? new Date() : null;
    // Calculate current week number
    const currentNewDate = new Date();
    const oneJan = new Date(currentNewDate.getFullYear(), 0, 1);
    const numberOfDays = Math.floor(
      (currentNewDate - oneJan) / (24 * 60 * 60 * 1000),
    );
    const currentWeekNumber = Math.ceil(
      (currentNewDate.getDay() + 1 + numberOfDays) / 7 - 1,
    );

    const createDate = date => ({
      date: date.toUTCString(),
      startDate: subFromDate(date, { months: 1 }),
      endDate: addToDate(date, { months: 1 }),
    });
    //
    const [schedulerData, setSchedulerData] = useState([]);
    const [currentDate, setDateChange] = useState(
      createDate(intialCurrentDate),
    );
    const [refetchState, setRefetchState] = useState(false);
    const [currentView, setViewChange] = useState('week');
    const [setNameMode, setTitleMode] = useState([]);
    const [currentWeek, setCurrentWeek] = useState({
      week: +currentWeekNumber,
    });
    const [appointment, setAppointment] = useState(null);
    const [formReadOnly] = useState(false);
    const [height, setHeight] = useState('auto');
    const wrapperRef = useRef(null);

    const mounted = useRef(false);
    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    const formatError = err => {
      const errorMessage =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].extensions.error) ||
        err.message;
      const errorTitle =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        (err.networkError && err.networkError.message);
      return [errorTitle, errorMessage];
    };
    // Retrieve data from selected model
    const { loading, data, refetch } =
      eventModel &&
      useAllQuery(
        eventModel,
        {
          take: 200,
          skip: 0,
          variables: {},
          onCompleted(res) {
            const hasResult = res && res.results && res.results.length > 0;
            if (hasResult) {
              B.triggerEvent('onSuccess', res.results);
            } else {
              B.triggerEvent('onNoResults');
            }
          },
          onError(err) {
            let errorText;
            if (typeof err === 'string') errorText = err;
            if (typeof err === 'object' && err !== null) {
              const [errorMessage] = formatError(err);
              errorText = errorMessage;
            }

            if (
              errorText !==
              "GraphQL error: Conditional '_and' cannot have an empty value."
            ) {
              B.triggerEvent('onError', err);
            }
          },
        },
        !eventModel,
      );
    const isValidDate = (date, enableTrigger = false) => {
      const condition = new Date(date) > new Date(calculatedMindate);
      if (!condition && enableTrigger) {
        B.triggerEvent('onInvalidDateInput');
      }
      return condition;
    };

    const handleNewDateInput = () => {
      B.triggerEvent('onNewDateInput');
    };

    B.defineFunction('Show name', () => setNameMode(true));
    B.defineFunction('Hide name', () => setNameMode(false));

    B.defineFunction('Show title', () => setTitleMode(true));
    B.defineFunction('Hide title', () => setTitleMode(false));
    function isDate(d) {
      const date = new Date(d);
      return date instanceof Date && !isNaN(date);
    }
    const calculateWeekNumber = date => {
      const inputDate = new Date(date);
      if (!isDate(inputDate)) {
        return -1;
      }
      const nowDate = new Date(inputDate.getTime());
      nowDate.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      nowDate.setDate(nowDate.getDate() + 3 - ((inputDate.getDay() + 6) % 7));
      // January 4 is always in week 1.
      const week1 = new Date(nowDate.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1.
      return (
        1 +
        Math.round(
          ((nowDate.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7,
        )
      );
    };
    const handleCurrentViewChange = view => {
      setViewChange(view);
      setCurrentWeek({ week: calculateWeekNumber(currentDate.date) });
    };

    const hasRRule = rRule => typeof rRule === 'string' && rRule !== '';

    const splitRRule = appointmentObj => {
      const { rRule } = appointmentObj;
      const options = rRule.split(';').filter(o => !o.startsWith('UNTIL'));
      const date = {
        year: calculatedMindate.getFullYear(),
        month: `0${calculatedMindate.getMonth() + 1}`.slice(-2),
        day: `0${calculatedMindate.getDate()}`.slice(-2),
      };
      const until = `UNTIL=${date.year}${date.month}${date.day}T000000Z`;
      options.push(until);
      const ruleString = options.join(';');
      return { ...appointmentObj, rRule: ruleString };
    };

    const isValidDelete = appointmentObj => {
      const { rRule, startDate } = appointmentObj;
      const isValidStartDate = isValidDate(startDate, true);
      const hasRule = hasRRule(rRule);
      if (hasRule) {
        const splittedRRule = splitRRule(appointmentObj);
        return [true, splittedRRule];
      }

      if (isValidStartDate) {
        return [true, null];
      }
      return [false, null];
    };

    const handleCommitChanges = ({ added, changed, deleted }) => {
      handleNewDateInput();
      let currentAppointment = null;
      if (added) {
        const startingAddedId = -1;
        currentAppointment = {
          id: startingAddedId,
          action: 'create',
          ...added,
        };
        setAppointment(currentAppointment);
        setSchedulerData([...schedulerData, currentAppointment]);
      }
      if (changed) {
        const newData = [];
        for (let i = 0; i < schedulerData.length; i += 1) {
          const appointmentObject = schedulerData[i];
          if (
            changed[appointmentObject.id] &&
            ((changed[appointmentObject.id].startDate &&
              isValidDate(changed[appointmentObject.id].startDate)) ||
              (changed[appointmentObject.id] &&
                changed[appointmentObject.id].startDate === undefined))
          ) {
            currentAppointment = {
              ...appointmentObject,
              ...changed[appointmentObject.id],
            };
            if (changed[appointmentObject.id].allDay === undefined) {
              currentAppointment.allDay = appointmentObject.allDay;
            }
            currentAppointment.action = 'update';
            newData.push({
              ...currentAppointment,
            });
            setAppointment(currentAppointment);
          } else {
            newData.push(appointmentObject);
          }
        }
        setSchedulerData(newData);
      }
      if (deleted !== undefined) {
        currentAppointment = schedulerData.filter(
          appointmentObj => appointmentObj.id === deleted,
        );
        const [isOkToDelete, splittedAppointment] = isValidDelete(
          currentAppointment,
        );

        if (!isOkToDelete) {
          return;
        }
        if (splittedAppointment) {
          currentAppointment = splittedAppointment;
          currentAppointment.action = 'split';
        } else {
          currentAppointment.action = 'delete';
        }

        setAppointment(currentAppointment);
        setSchedulerData(
          schedulerData.filter(appointmentObj => appointmentObj.id !== deleted),
        );
      }
    };

    const [actionCallback, { loading: actionLoading }] = useAction(actionId, {
      variables: {
        input: {
          form_data: appointment,
          ...(dynamicWebuserIdTExt !== '' && {
            webuser_id: dynamicWebuserIdTExt,
          }),
        },
      },
      onCompleted(res) {
        if (res.actionb5.action === 'refetch') {
          refetch();
        }
        B.triggerEvent('onActionSuccess', res.actionb5);
      },
      onError(err) {
        B.triggerEvent('onActionError', err);
        setSchedulerData([]);
        setRefetchState(true);
        refetch();
      },
    }) || [() => {}, { actionLoading: false }];

    B.defineFunction('RefetchData', () => {
      setRefetchState(true);
      refetch();
    });

    useEffect(() => {
      if (appointment) {
        actionCallback();
      }
    }, [appointment]);

    useEffect(() => {
      if (mounted.current && loading) {
        B.triggerEvent('onLoad', loading);
      }
    }, [loading]);

    useEffect(() => {
      if (mounted.current && actionLoading) {
        B.triggerEvent('onActionLoad', actionLoading);
      }
    }, [actionLoading]);
    // Push retrieved data into array
    useEffect(() => {
      if (!isDev && data && data.results) {
        if (refetchState) {
          setRefetchState(false);
        }
        const newData = [];

        data.results.forEach(a => {
          newData.push({
            startDate: a.startTime,
            endDate: a.endTime,
            title: a.room.name,
            notes: a.notes,
            color: a.room.colorHex,
            id: a.id,
            webUser: a.webUser,
            externalMeeting: a.externalMeeting,
            subTitle: a.subTitle,
            guests: a.guestNamesConcat,
          });
        });
        setSchedulerData(newData);
      }
    }, [data, refetchState]);

    const hanleCurrentDateChange = date => {
      setDateChange(createDate(date));
      setCurrentWeek({ week: calculateWeekNumber(date) });
    };

    const handleAllowDrag = ({ startDate, isBlocked }) =>
      isValidDate(startDate) && !isBlocked;
    const DayCellBase = React.memo(
      ({ startDate, onDoubleClick, ...restProps }) => {
        const isValid = isValidDate(startDate);

        return (
          <DayView.TimeTableCell
            className={[
              !isValid ? classes.disabledDay : '',
              classes.defaultDay,
            ].join(' ')}
            startDate={startDate}
            {...(isValid ? { onDoubleClick } : { onDoubleClick: () => {} })}
            {...restProps}
          />
        );
      },
    );
    const WeekTimeTableCell = React.memo(
      ({ startDate, onDoubleClick, ...restProps }) => {
        const isValid = isValidDate(startDate);
        return (
          <WeekView.TimeTableCell
            className={[
              !isValid ? classes.disabledDay : '',
              classes.defaultDay,
            ].join(' ')}
            startDate={startDate}
            {...(isValid ? { onDoubleClick } : { onDoubleClick: () => {} })}
            {...restProps}
          />
        );
      },
    );
    const FlexibleSpace = ({ ...restProps }) => (
      <Toolbar.FlexibleSpace
        {...restProps}
        style={{ justifyContent: 'start', margin: 'auto' }}
      >
        <Box>
          <p className={classes.weekNumber}>
            <b>{currentView === 'week' ? `W${currentWeek.week}` : ''}</b>
          </p>
        </Box>
      </Toolbar.FlexibleSpace>
    );

    const Selector = props => <AppointmentForm.Select {...props} />;

    const DateEditor = ({
      readOnly,
      excludeTime,
      locale: dateLocale,
      ...props
    }) => {
      const dateFormat = excludeTime ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm';

      const onOpen = () => {
        const daysHeading = document.querySelector(
          '.MuiPickersCalendarHeader-daysHeader',
        );

        const days = (schedulerTranslation &&
          schedulerTranslation.datePicker &&
          schedulerTranslation.datePicker.daysShort) || [
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Sat',
          'Sun',
        ];

        const dayItems =
          daysHeading &&
          daysHeading.querySelectorAll('.MuiPickersCalendarHeader-dayLabel');
        if (days && dayItems) {
          dayItems.forEach((element, index) => {
            const elementData = element;
            if (days[index]) {
              elementData.innerText = days[index];
            }
          });
        }
      };

      return (
        <AppointmentForm.DateEditor
          {...props}
          readOnly={readOnly}
          format={dateFormat}
          ampm={false}
          PopoverProps={{ onEntering: onOpen }}
          disablePast={!readOnly}
          minDate={
            readOnly
              ? new Date(1970)
              : addToDate(calculatedMindate, { days: 1 })
          }
          views={['date']}
        />
      );
    };

    const Recurrent = props => (
      <EditRecurrenceMenu.Layout
        {...props}
        availableOperations={[{ value: 'all', title: 'Does not matter' }]}
        className={classes.hideRecurrentOptions}
      />
    );

    // Determines the color of the appointments on the calender
    const getAppointmentColor = appointmentData =>
      useEventColor && appointmentData.color
        ? appointmentData.color
        : colors[appointmentData.category];
    // Content of the tooltip header
    const Header = ({ appointmentData, ...restProps }) => {
      const readOnly =
        !isValidDate(appointmentData.startDate) || appointmentData.isBlocked;
      return (
        <AppointmentTooltip.Header
          {...restProps}
          showCloseButton
          showOpenButton
          showDeleteButton={!readOnly}
        />
      );
    };
    const RecurrenceLayout = ({
      onFieldChange,
      appointmentData,
      ...restProps
    }) => (
      <AppointmentForm.RecurrenceLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
        dateEditorComponent={DateEditor}
      />
    );
    const transformAppointmentTitle = appointmentData => {
      const transformAppointmentTitleData = appointmentData;
      if (
        showWebuser &&
        transformAppointmentTitleData.webUser &&
        transformAppointmentTitleData.webUser.lastName
      ) {
        transformAppointmentTitleData.title = `${transformAppointmentTitleData.webUser.lastName} - ${transformAppointmentTitleData.title}`;
      }
      return transformAppointmentTitleData;
    };

    const AppointmentContent = ({ data: aData, ...restProps }) => {
      let appointmentData = { ...aData };
      appointmentData = transformAppointmentTitle(appointmentData);
      return (
        <Appointments.AppointmentContent
          {...restProps}
          data={appointmentData}
        />
      );
    };

    const Appointment = ({
      data: appointmentData,
      style,
      onClick,
      onDoubleClick,
      ...restProps
    }) => {
      const appointmentColor = getAppointmentColor(appointmentData);

      const isEditeble =
        isValidDate(appointmentData.startDate) && !appointmentData.isBlocked;

      let clickTimer;

      const handleOnClick = event => {
        if (enableTooltip) {
          onClick(event);
        }

        if (!clickTimer) {
          clickTimer = setTimeout(() => {
            B.triggerEvent('onClick', appointmentData.id);
            clickTimer = undefined;
          }, 300);
        }
      };

      const handleOnDoubleClick = event => {
        B.triggerEvent('onDoubleClick', appointmentData.id);
        clearTimeout(clickTimer);
        clickTimer = undefined;
        if (enableForm) {
          onDoubleClick(event);
        }
      };

      return (
        <Appointments.Appointment
          {...restProps}
          data={appointmentData}
          onClick={handleOnClick}
          onDoubleClick={handleOnDoubleClick}
          style={{
            ...style,
            backgroundColor: appointmentColor,
            filter: isEditeble ? 'brightness(100%)' : 'brightness(60%)',
            minHeight: 25,
          }}
        />
      );
    };

    // Contents for the tooltips
    const TooltipContent = ({ appointmentData, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
        container
        alignItems="center"
      >
        <span>
          <hr />
          <Grid container alignItems="center" className={classes.containerTool}>
            <Grid item xs={2} className={classes.iconTool}>
              <Person className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
              <span style={{ fontWeight: 'bold' }}>Host:</span> <br />
              <span>{appointmentData.webUser.fullName}</span>
            </Grid>
          </Grid>
        </span>
        <span>
          {appointmentData.guests !== '' ? (
            <span>
              <Grid
                container
                alignItems="center"
                className={classes.containerTool}
              >
                <Grid item xs={2} className={classes.iconTool}>
                  <People className={classes.icon} />
                </Grid>
                <Grid item xs={10}>
                  <span style={{ fontWeight: 'bold' }}>Guest(s):</span> <br />
                  <span>{appointmentData.guests}</span> <br />
                </Grid>
              </Grid>
            </span>
          ) : null}
        </span>
        <span>
          <Grid container alignItems="center" className={classes.containerTool}>
            <Grid item xs={2} className={classes.iconTool}>
              <AirplanemodeActive className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
              <span style={{ fontWeight: 'bold' }}>External meeting:</span>{' '}
              <span>
                {appointmentData.externalMeeting === true ? (
                  <Check
                    style={{
                      color: 'green',
                      width: '20px',
                      height: '20px',
                      verticalAlign: 'bottom',
                    }}
                  />
                ) : (
                  <Close
                    style={{
                      color: 'red',
                      width: '20px',
                      height: '20px',
                      verticalAlign: 'bottom',
                    }}
                  />
                )}
              </span>
            </Grid>
          </Grid>
        </span>
        <span>
          {appointmentData.subTitle !== '' ? (
            <span>
              <Grid
                container
                alignItems="center"
                className={classes.containerTool}
              >
                <Grid item xs={2} className={classes.iconTool}>
                  <Title className={classes.icon} />
                </Grid>
                <Grid item xs={10}>
                  <span style={{ fontWeight: 'bold' }}>Sub-title:</span> <br />
                  <span>{appointmentData.subTitle}</span>
                </Grid>
              </Grid>
            </span>
          ) : null}
        </span>
        <span>
          {appointmentData.notes !== '' ? (
            <span>
              <Grid
                container
                wrap="nowrap"
                alignItems="center"
                className={classes.containerTool}
              >
                <Grid item xs={2} className={classes.iconTool}>
                  <Note className={classes.icon} />
                </Grid>
                <Grid item xs={10}>
                  <span style={{ fontWeight: 'bold' }}>Notes:</span> <br />
                  <span>{appointmentData.notes}</span>
                </Grid>
              </Grid>
            </span>
          ) : null}
        </span>
      </AppointmentTooltip.Content>
    );

    const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
      const sData = appointmentData;
      sData.startDate = new Date(appointmentData.startDate);
      sData.endDate = new Date(appointmentData.endDate);
      const onCategoryFieldChange = nextValue => {
        onFieldChange({ roomList: nextValue });
      };

      if (appointmentData.title === undefined) {
        onFieldChange({ title: defaultTitle });
      }
      if (appointmentData.startDate >= appointmentData.endDate) {
        B.triggerEvent(
          'onError',
          'End date must be greater than the start date. End date has been reset',
        );
        onFieldChange({
          startDate: appointmentData.startDate,
          endDate: addToDate(appointmentData.startDate, {
            days: 1,
          }),
        });
      }

      return (
        <AppointmentForm.BasicLayout
          appointmentData={appointmentData}
          onFieldChange={onFieldChange}
          {...restProps}
          dateEditorComponent={DateEditor}
        >
          {showCustomForm && (
            <>
              <AppointmentForm.Label text="Room" type="title" />
              <AppointmentForm.Select
                type="outlinedSelect"
                onValueChange={onCategoryFieldChange}
              />
            </>
          )}
        </AppointmentForm.BasicLayout>
      );
    };

    function checkResize(mutations) {
      const el = mutations[0].target;
      const w = el.clientWidth;
      const h = el.clientHeight;

      const isChange = mutations
        .map(m => `${m.oldValue}`)
        .some(
          prev =>
            prev.indexOf(`width: ${w}px`) === -1 ||
            prev.indexOf(`height: ${h}px`) === -1,
        );

      if (!isChange) {
        return;
      }
      const event = new CustomEvent('resize', {
        detail: { width: w, height: h },
      });
      el.dispatchEvent(event);
    }

    useEffect(() => {
      if (wrapperRef.current) {
        wrapperRef.current.addEventListener('resize', event =>
          setHeight(event.detail.height),
        );

        const observer = new MutationObserver(checkResize);
        observer.observe(wrapperRef.current, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ['style'],
        });
      }
    }, [checkResize]);
    const SchedulerComponent = (
      <div
        ref={wrapperRef}
        className={[isDev && classes.wrapper, classes.resize].join(' ')}
      >
        <Scheduler
          data={schedulerData}
          height={height}
          firstDayOfWeek={1}
          locale={localeMap[locale]}
        >
          <ViewState
            currentDate={currentDate.date}
            onCurrentDateChange={hanleCurrentDateChange}
            currentViewName={currentView}
            onCurrentViewNameChange={handleCurrentViewChange}
          />
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton messages={schedulerTranslation.todayButton} />
          <EditingState onCommitChanges={handleCommitChanges} />
          <EditRecurrenceMenu
            messages={schedulerTranslation.editRecurrenceMenu}
            layoutComponent={Recurrent}
          />
          <DayView
            name="day"
            displayName={
              schedulerTranslation.dayView.displayName
                ? schedulerTranslation.dayView.displayName
                : 'Day'
            }
            startDayHour={startTime}
            endDayHour={endTime}
            timeTableCellComponent={DayCellBase}
          />
          <WeekView
            name="week"
            displayName={
              schedulerTranslation.weekView.name
                ? schedulerTranslation.weekView.displayName
                : 'Week'
            }
            startDayHour={startTime}
            endDayHour={endTime}
            timeTableCellComponent={WeekTimeTableCell}
            dayScaleEmptyCellComponent={FlexibleSpace}
            excludedDays={[0, 6]}
          />
          <ConfirmationDialog
            messages={schedulerTranslation.confirmationDialog}
          />
          <Appointments
            appointmentComponent={Appointment}
            appointmentContentComponent={AppointmentContent}
          />
          <AppointmentTooltip
            headerComponent={Header}
            contentComponent={TooltipContent}
          />
          <AppointmentForm
            readOnly={formReadOnly}
            basicLayoutComponent={BasicLayout}
            recurrenceLayoutComponent={RecurrenceLayout}
            selectComponent={Selector}
            messages={schedulerTranslation.appointmentForm}
          />
          <DragDropProvider allowDrag={handleAllowDrag} />
          <CurrentTimeIndicator shadePreviousCells />
        </Scheduler>
      </div>
    );
    const SchedulerComponentIsDev = (
      <div
        ref={wrapperRef}
        className={[isDev && classes.wrapper, classes.resize].join(' ')}
      >
        <Scheduler
          height={height}
          firstDayOfWeek={1}
          locale={localeMap[locale]}
        >
          <ViewState
            currentDate={currentDate.date}
            onCurrentDateChange={hanleCurrentDateChange}
            currentViewName={currentView}
            onCurrentViewNameChange={handleCurrentViewChange}
          />
          <Toolbar flexibleSpaceComponent={FlexibleSpace} />
          <DateNavigator />
          <ViewSwitcher />
          <EditingState onCommitChanges={handleCommitChanges} />
          <EditRecurrenceMenu
            messages={schedulerTranslation.editRecurrenceMenu}
            layoutComponent={Recurrent}
          />
          <WeekView
            name="week"
            displayName={
              schedulerTranslation.weekView.name
                ? schedulerTranslation.weekView.displayName
                : 'Week'
            }
            startDayHour={startTime}
            endDayHour={endTime}
            timeTableCellComponent={WeekTimeTableCell}
          />
        </Scheduler>
      </div>
    );
    if (isDev) {
      return SchedulerComponentIsDev;
    }
    return SchedulerComponent;
  })(),
  styles: B => t => {
    const style = new B.Styling(t);
    return {
      content: {
        color: ({ options: { textColor } }) => style.getColor(textColor),
      },
      wrapper: {
        width: '100%',
        height: '100px',
        '& > *': {
          pointerEvents: 'none',
        },
      },
      weekNumber: {
        textAlign: 'center',
        whiteSpace: 'nowrap',
      },
      hideRecurrentOptions: {
        '& div[class="MuiDialogContent-root"]': {
          display: 'none',
        },
      },
      defaultDay: {
        padding: 0,
        boxSizing: 'border-box',
        userSelect: 'none',
        borderRight: '1px solid rgba(224, 224, 224, 1)',
        verticalAlign: 'top',
      },
      disabledDay: {
        color: '#D91898',
      },
      timeLabel: {
        height: '100px',
        lineHeight: '98px',
        '&:first-child': {
          height: '50px',
        },
        '&:last-child': {
          height: '50px',
        },
      },
      week: {
        position: 'absolute',
        top: '7px',
        left: '8px',
        color: 'rgba(0, 0, 0, 0.38)',
      },
      cell: {
        position: 'relative !important',
        userSelect: 'none !important',
        verticalAlign: 'top !important',
        padding: '0px !important',
        borderRight: '1px solid rgba(224, 224, 224, 1) !important',
        '&:last-child': {
          borderRight: 'none !important',
          paddingRight: '0px !important',
        },
        'tr:last-child &': {
          borderBottom: 'none !important',
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        '&:focus': {
          backgroundColor: 'rgba(63, 81, 181, 0.15)',
          outline: 0,
        },
        boxSizing: 'border-box',
      },
      resize: {
        resize: 'vertical',
        overflow: 'auto',
        minHeight: '693px',
      },
      text: {
        padding: '1em',
        paddingTop: '0.5em',
        textAlign: 'center',
        [`@media (max-width: ${500}px)`]: {
          padding: '0.5em',
        },
      },
      today: {
        marginTop: '0.33em',
        width: '1.72em',
        height: '1.72em',
        lineHeight: 1.72,
        textAlign: 'center',
        borderRadius: '50%',
        background: '#3f51b5',
        color: '#fff',
        cursor: 'default',
        marginRight: 'auto',
        marginLeft: 'auto',
      },
      otherMonth: {
        color: 'rgba(0, 0, 0, 0.38)',
      },
      shadedCell: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        '&:focus': {
          backgroundColor: 'rgba(63, 81, 181, 0.15)',
          outline: 0,
        },
      },
      brightRightBorder: {
        borderRight: '1px solid rgba(224, 224, 224, 0.72)',
        '&:last-child': {
          borderRight: 'none',
        },
      },
      brightBorderBottom: {
        borderBottom: '1px solid rgba(224, 224, 224, 0.72)',
      },
      icon: {
        marginLeft: '20px',
        mrginBottom: '2px',
      },
      containerTool: {
        display: 'flex',
        paddingBottom: '8px',
      },
      iconTool: {
        display: 'flex',
      },
    };
  },
}))();
