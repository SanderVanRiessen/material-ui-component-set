(() => ({
  name: 'Scheduler',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { Box, TableCell } = window.MaterialUI.Core;
    const { EditingState, ViewState } = window.MaterialUI.Scheduler;
    const {
      Scheduler,
      DayView,
      Appointments,
      Toolbar,
      MonthView,
      WeekView,
      ViewSwitcher,
      DateNavigator,
      DragDropProvider,
      TodayButton,
      AppointmentTooltip,
      AppointmentForm,
      EditRecurrenceMenu,
      ConfirmationDialog,
      AllDayPanel,
      CurrentTimeIndicator,
    } = window.MaterialUI.MUIScheduler;
    const { add: addToDate, sub: subFromDate } = window.MaterialUI;
    const { getProperty, useText, useAction, useAllQuery, useFilter } = B;
    const isDev = B.env === 'dev';
    const {
      filter,
      filterOnly,
      eventModel,
      actionId,
      eventCategory,
      showCategory,
      showWebuser,
      showActivity,
      defaultCategory,
      useEventColor,
      colorZakelijk,
      colorPrive,
      locale,
      defaultTitle,
      startTime,
      endTime,
      useMinMonth,
      disabledPast,
      minMonth,
      dynamicLandingDate,
      dynamicWebuserId,
      enableTooltip,
      enableForm,
      blockEdit,
    } = options;

    const translationMap = {
      nl: 'NL',
    };

    const localeMap = {
      nl: 'nl-NL',
      en: 'en-EN',
    };

    const colors = {
      Default: '#20659A',
      Zakelijk: colorZakelijk,
      Prive: colorPrive,
    };

    const localeTranslation = translationMap[locale];
    const { scheduler: schedulerTranslation } = window.MaterialUI.Translations[
      localeTranslation
    ];

    const now = new Date();

    const landingDateText = useText(dynamicLandingDate);
    const dynamicWebuserIdTExt = useText(dynamicWebuserId);

    const landingDate = new Date(`${landingDateText}`);

    const intialCurrentDate =
      landingDate instanceof Date && isFinite(landingDate) ? landingDate : now;

    const dateMonths = addToDate(new Date(), {
      months: minMonth || 0,
    });

    // useMinMonth necesary for 0 values that are auto treated as null in prefab
    const calculatedMindate = disabledPast
      ? new Date()
      : (minMonth !== undefined || minMonth !== null) && useMinMonth
      ? new Date(dateMonths.getFullYear(), dateMonths.getMonth() + 1, 0)
      : null;

    const createDate = date => ({
      date: date.toUTCString(),
      startDate: subFromDate(date, { months: 1 }),
      endDate: addToDate(date, { months: 1 }),
    });

    const [schedulerData, setSchedulerData] = useState([]);
    const [currentDate, setDateChange] = useState(
      createDate(intialCurrentDate),
    );

    const [refetchState, setRefetchState] = useState(false);
    const [currentView, setViewChange] = useState('week');
    const [currentWeek, setCurrentWeek] = useState({ week: 0 });
    const [appointment, setAppointment] = useState(null);
    const [formReadOnly, setFormReadOnly] = useState(false);
    const [height, setHeight] = useState(800);
    const wrapperRef = useRef(null);

    const { kind, values = [] } = getProperty(eventCategory) || {};
    const defaultCategoryText = useText(defaultCategory);

    const getCategories = () => {
      if (kind === 'list' || kind === 'LIST') {
        return values.map(({ value: v }) => ({ id: v, text: v }));
      }
      return [];
    };

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

    const deepMerge = (...objects) => {
      const isObject = item =>
        item && typeof item === 'object' && !Array.isArray(item);

      return objects.reduce((accumulator, object) => {
        Object.keys(object).forEach(key => {
          const accumulatorValue = accumulator[key];
          const value = object[key];

          if (Array.isArray(accumulatorValue) && Array.isArray(value)) {
            accumulator[key] = accumulatorValue.concat(value);
          } else if (isObject(accumulatorValue) && isObject(value)) {
            accumulator[key] = deepMerge(accumulatorValue, value);
          } else {
            accumulator[key] = value;
          }
        });
        return accumulator;
      }, {});
    };

    const paginationFilterAndRrule = {
      _or: [
        {
          _and: [
            { startDate: { gteq: currentDate.startDate.toISOString() } },
            { startDate: { lteq: currentDate.endDate.toISOString() } },
            { endDate: { gteq: currentDate.startDate.toISOString() } },
            { endDate: { lteq: currentDate.endDate.toISOString() } },
          ],
        },
        { rRule: { neq: null } },
      ],
    };

    const paginationFilter = {
      _and: [
        { startDate: { gteq: currentDate.startDate.toISOString() } },
        { startDate: { lteq: currentDate.endDate.toISOString() } },
        { endDate: { gteq: currentDate.startDate.toISOString() } },
        { endDate: { lteq: currentDate.endDate.toISOString() } },
      ],
    };

    const where = filterOnly
      ? deepMerge(useFilter(filter), paginationFilter)
      : deepMerge(useFilter(filter), paginationFilterAndRrule);

    // eslint-disable-next-line no-unused-vars
    const { loading, error, data, refetch } =
      eventModel &&
      useAllQuery(eventModel, {
        rawFilter: where,
        take: 200,
        skip: 0,
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
      });

    const categories = getCategories();

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
    // prettier-ignore
    const calculateWeekNumber = date => {
      const inputDate = new Date(date)
      if (!isDate(inputDate)) {
        return -1
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

    function isDate(d) {
      const date = new Date(d);
      return date instanceof Date && !isNaN(date);
    }

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
        console.log('Added', added);
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
        for (let i = 0; i < schedulerData.length; i++) {
          const appointmentObject = schedulerData[i];
          if (
            changed[appointmentObject.id] &&
            ((changed[appointmentObject.id].startDate &&
              isValidDate(changed[appointmentObject.id].startDate)) ||
              (changed[appointmentObject.id] &&
                changed[appointmentObject.id].startDate === undefined))
          ) {
            console.log(appointmentObject, changed);
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
        )[0];
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

    useEffect(() => {
      if (!isDev && data && data.results) {
        const { results } = data;
        if (refetchState) {
          setRefetchState(false);
        }
        setSchedulerData([...results]);
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
            style={{ height: 20 }}
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
    /*
    const TimeTableCell = props => {
      const classes = useStyles();
      return (
        <WeekView.TimeTableCell {...props} className={classes.timeTableCell} />
      );
    };
    const TimeLabel = props => {
      const classes = useStyles();
      return (
        <WeekView.TimeScaleLabel {...props} className={classes.timeLabel} />
      );
    };
    const TickCell = props => {
      const classes = useStyles();
      return (
        <WeekView.TimeScaleTickCell
          {...props}
          className={classes.timeTableCell}
        />
      );
    };
    */
    const MonthTimeTableCell = React.memo(
      ({
        startDate,
        onDoubleClick,
        formatDate,
        isShaded,
        otherMonth,
        endOfGroup,
        hasRightBorder,
        groupOrientation,
        today,
        ...restProps
      }) => {
        const isValid = isValidDate(startDate);
        const isFirstMonthDay = startDate.getDate() === 1;
        const formatOptions =
          isFirstMonthDay && !today
            ? { day: 'numeric', month: 'short' }
            : { day: 'numeric' };
        const weekNumber =
          new Date(startDate).getDay() === 1
            ? `W ${calculateWeekNumber(startDate)}`
            : null;
        return (
          <TableCell
            tabIndex={0}
            className={[
              classes.cell,
              !isValid && classes.disabledDay,
              isShaded && classes.shadedCell,
              (endOfGroup || hasRightBorder) &&
                groupOrientation === 'Horizontal' &&
                classes.brightRightBorder,
              endOfGroup &&
                groupOrientation === 'Vertical' &&
                classes.brightBorderBottom,
            ].join(' ')}
            style={{ height: `${(height - 93) / 6}px` }}
            {...(isValid ? { onDoubleClick } : { onDoubleClick: () => {} })}
            {...restProps}
          >
            <div className={classes.week}>{weekNumber}</div>
            <div
              className={[
                today ? classes.today : classes.text,
                otherMonth && !today && classes.otherMonth,
              ].join(' ')}
            >
              {formatDate(startDate, formatOptions)}
            </div>
          </TableCell>
        );
      },
    );

    const FlexibleSpace = ({ ...restProps }) => (
      <Toolbar.FlexibleSpace {...restProps} style={{ justifyContent: 'start' }}>
        <Box>
          <p className={classes.weekNumber}>
            {currentView === 'week' ? `Week: ${currentWeek.week}` : ''}
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
            if (days[index]) {
              element.innerText = days[index];
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
        availableOperations={[{ value: 'all', title: 'Does not mather' }]}
        className={classes.hideRecurrentOptions}
      />
    );

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
      if (showActivity && appointmentData.subprojectactivity) {
        const subprojectActivity =
          appointmentData.subprojectactivity?.name ?? '';
        const subProjectCode =
          appointmentData.subprojectactivity?.phase?.subproject?.code ?? '';

        appointmentData.title = `${subprojectActivity}${
          subprojectActivity && subProjectCode ? ' - ' : ''
        }${subProjectCode}`;
      }
      if (
        showWebuser &&
        appointmentData.webuser &&
        appointmentData.webuser.lastName
      ) {
        appointmentData.title = `${appointmentData.webuser?.lastName} - ${appointmentData.title}`;
      }
      return appointmentData;
    };

    const getAppointmentColor = appointmentData =>
      useEventColor && appointmentData.color
        ? appointmentData.color
        : colors[appointmentData.category]
        ? colors[appointmentData.category]
        : colors.Default;

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
            opacity: isEditeble ? 1 : 0.7,
          }}
        />
      );
    };

    const TooltipContent = ({ appointmentData, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
      />
    );

    const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
      appointmentData.startDate = new Date(appointmentData.startDate);
      appointmentData.endDate = new Date(appointmentData.endDate);
      const onCategoryFieldChange = nextValue => {
        onFieldChange({ category: nextValue });
      };

      if (appointmentData.title === undefined) {
        onFieldChange({ title: defaultTitle });
      }
      if (appointmentData.category === undefined) {
        onFieldChange({ category: defaultCategoryText });
      }
      if (appointmentData.startDate >= appointmentData.endDate) {
        B.triggerEvent(
          'onError',
          'Eind datum moet groter zijn dan start datum. Eind datum is gereset!',
        );
        onFieldChange({
          startDate: appointmentData.startDate,
          endDate: addToDate(appointmentData.startDate, {
            days: 1,
          }),
        });
      }

      const readOnly =
        (appointmentData.id &&
          isDate(appointmentData.startDate) &&
          !isValidDate(appointmentData.startDate)) ||
        (appointmentData.isBlocked && blockEdit);

      setFormReadOnly(readOnly);
      return (
        <AppointmentForm.BasicLayout
          appointmentData={appointmentData}
          onFieldChange={onFieldChange}
          {...restProps}
          dateEditorComponent={DateEditor}
          readOnly={readOnly}
        >
          {showCategory && (
            <>
              <AppointmentForm.Label text="Zakelijk/Prive" type="title" />
              <AppointmentForm.Select
                value={appointmentData.category || defaultCategoryText}
                type="outlinedSelect"
                onValueChange={onCategoryFieldChange}
                availableOptions={categories}
                readOnly={readOnly}
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
          <Toolbar flexibleSpaceComponent={FlexibleSpace} />
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
            //timeScaleLabelComponent={TimeLabel}
            //timeScaleTickCellComponent={TickCell}
          />
          <MonthView
            name="month"
            displayName={
              schedulerTranslation.monthView.displayName
                ? schedulerTranslation.monthView.displayName
                : 'Month'
            }
            timeTableCellComponent={MonthTimeTableCell}
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
          <CurrentTimeIndicator shadePreviousCells={true} />
        </Scheduler>
      </div>
    );

    return SchedulerComponent;
  })(),
  styles: B => t => {
    const style = new B.Styling(t);
    const { fade } = window.MaterialUI.Core;

    return {
      /* timeTableCell: {
        height: '20px',
      },
      timeLabel: {
        marginTop: '80px',
        height: '100px',
        lineHeight: '49px',
        '&:first-child': {
          height: '130px',
        },
        '&:last-child': {
          height: '0px',
        },
      },*/
      wrapper: {
        width: '100%',
        height: '100%',
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
        backgroundImage: `repeating-linear-gradient(135deg,
          rgba(244, 67, 54, 0.1),
          rgba(244, 67, 54, 0.1) 2px,
          transparent 4px,
          transparent 9px)`,
        color: '#9B6467',
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
    };
  },
}))();