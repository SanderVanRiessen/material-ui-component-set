(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { FullCalendar, dayGridPlugin, interactionPlugin } =
      window.MaterialUI;

    const handleDateClick = (arg) => {
      // bind with an arrow function
      alert(arg.dateStr);
    };

    return (
      <div className={classes.root}>
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
          />
        </>
      </div>
    );
  })(),
  styles: () => () => {
    return {
      root: {},
    };
  },
}))();
