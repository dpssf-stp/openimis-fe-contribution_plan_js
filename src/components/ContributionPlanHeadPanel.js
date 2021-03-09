import React, { Fragment } from "react";
import { Grid, Divider, Typography } from "@material-ui/core";
import {
    withModulesManager,
    formatMessage,
    FormPanel,
    TextInput,
    FormattedMessage,
    PublishedComponent,
    NumberInput,
    Contributions
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    EMPTY_PERIODICITY_VALUE,
    MIN_PERIODICITY_VALUE,
    MAX_PERIODICITY_VALUE,
    CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY,
    CONTRIBUTIONPLAN_CLASSNAME,
    RIGHT_CALCULATION_WRITE,
    RIGHT_CALCULATION_UPDATE
} from "../constants";

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    }
});

const GRID_ITEM_SIZE = 3;

class ContributionPlanHeadPanel extends FormPanel {
    render() {
        const { intl, classes, mandatoryFieldsEmpty } = this.props;
        /**
         * Mapping @see benefitPlan property into @see product property is required
         * because property names of @see ContributionPlan object on frontend
         * have to match property names of a corresponding object on backend.
         * Also, @see calculation property, which is a UUID, has to be converted into an object
         * so that its @see id property can be used to fetch calculation parameters
         */
        const { benefitPlan: product, calculation: calculationId, ...others } = this.props.edited;
        const calculation = { id: calculationId };
        const contributionPlan = { product, calculation, ...others };
        return (
            <Fragment>
                <Grid container className={classes.tableTitle}>
                    <Grid item>
                        <Grid
                            container
                            align="center"
                            justify="center"
                            direction="column"
                            className={classes.fullHeight}
                        >
                            <Grid item>
                                <Typography>
                                    <FormattedMessage module="contributionPlan" id="contributionPlan.headPanel.title" />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                {mandatoryFieldsEmpty && (
                    <Fragment>
                        <div className={classes.item}>
                            <FormattedMessage module="contributionPlan" id="mandatoryFieldsEmptyError" />
                        </div>
                        <Divider />
                    </Fragment>
                )}
                <Grid container className={classes.item}>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <TextInput
                            module="contributionPlan"
                            label="code"
                            required
                            value={!!contributionPlan && !!contributionPlan.code ? contributionPlan.code : ""}
                            onChange={(v) => this.updateAttribute("code", v)}
                            readOnly={!!contributionPlan && !!contributionPlan.id}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <TextInput
                            module="contributionPlan"
                            label="name"
                            required
                            value={!!contributionPlan && !!contributionPlan.name ? contributionPlan.name : ""}
                            onChange={(v) => this.updateAttribute("name", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <TextInput
                            /**
                             * a @see TextInput until @see Calculation module provides a picker
                             */
                            module="contributionPlan"
                            label="calculation"
                            required
                            value={
                                !!contributionPlan &&
                                !!contributionPlan.calculation &&
                                !!contributionPlan.calculation.id
                                    ? contributionPlan.calculation.id
                                    : ""
                            }
                            onChange={(v) => this.updateAttribute("calculation", v)}
                        />
                    </Grid>
                    <Contributions
                        contributionKey={CONTRIBUTIONPLAN_CALCULATION_CONTRIBUTION_KEY}
                        intl={intl}
                        className={CONTRIBUTIONPLAN_CLASSNAME}
                        entity={contributionPlan}
                        requiredRights={[
                            !!contributionPlan && !!contributionPlan.id
                                ? RIGHT_CALCULATION_UPDATE
                                : RIGHT_CALCULATION_WRITE,
                        ]}
                        value={!!contributionPlan && !!contributionPlan.jsonExt ? contributionPlan.jsonExt : null}
                        onChange={this.updateAttribute}
                        gridItemStyle={classes.item}
                        gridItemSize={GRID_ITEM_SIZE}
                    />
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <PublishedComponent
                            pubRef="product.ProductPicker"
                            withNull={true}
                            label={formatMessage(intl, "contributionPlan", "benefitPlan")}
                            required
                            value={!!contributionPlan && !!contributionPlan.product ? contributionPlan.product : null}
                            onChange={(v) => this.updateAttribute("benefitPlan", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <NumberInput
                            module="contributionPlan"
                            label="periodicity"
                            required
                            /**
                             * @see min set to @see EMPTY_PERIODICITY_FILTER when filter unset to avoid @see NumberInput error message
                             */
                            min={
                                !!contributionPlan && !!contributionPlan.periodicity
                                    ? MIN_PERIODICITY_VALUE
                                    : EMPTY_PERIODICITY_VALUE
                            }
                            max={MAX_PERIODICITY_VALUE}
                            value={
                                !!contributionPlan && !!contributionPlan.periodicity
                                    ? contributionPlan.periodicity
                                    : null
                            }
                            onChange={(v) => this.updateAttribute("periodicity", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="contributionPlan"
                            label="dateValidFrom"
                            required
                            value={
                                !!contributionPlan && !!contributionPlan.dateValidFrom
                                    ? contributionPlan.dateValidFrom
                                    : null
                            }
                            onChange={(v) => this.updateAttribute("dateValidFrom", v)}
                        />
                    </Grid>
                    <Grid item xs={GRID_ITEM_SIZE} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="contributionPlan"
                            label="dateValidTo"
                            value={
                                !!contributionPlan && !!contributionPlan.dateValidTo
                                    ? contributionPlan.dateValidTo
                                    : null
                            }
                            onChange={(v) => this.updateAttribute("dateValidTo", v)}
                        />
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(ContributionPlanHeadPanel))))
