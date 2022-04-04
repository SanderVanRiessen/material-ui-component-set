(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { FullCalendar, dayGridPlugin, interactionPlugin, timeGridPlugin } =
      window.MaterialUI;

    const { visible } = options;

    const handleDateClick = () => {
      // bind with an arrow function
    };

    return visible ? (
      <div className={classes.root}>
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            dateClick={handleDateClick}
            selectable
          />
        </>
      </div>
    ) : (
      <></>
    );
  })(),
  styles: () => () => {
    return {
      root: {},
    };
  },
}))();
