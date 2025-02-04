/*
 * Copyright 2024 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { wizApiRef } from '../../api';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { BarChart } from '.';
import { WIZ_PROJECT_ANNOTATION } from '../constants';
import { useStyles } from '../../style';
import { Typography } from '@material-ui/core';
import wizLogo from '../../assets/wiz-logo.png';

export const SeverityChart = () => {
  const api = useApi(wizApiRef);
  const classes = useStyles();
  const { entity } = useEntity();
  const wizAnnotation =
    entity?.metadata.annotations?.[WIZ_PROJECT_ANNOTATION] ?? '';

  const WizIcon = () => {
    return <img src={wizLogo} alt="WIZ Logo" className={classes.logo} />;
  };

  const { value, loading, error } = useAsync(async () => {
    return await api.fetchIssuesForProject(wizAnnotation);
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard
      title="Severity graph"
      headerProps={{
        action: <WizIcon />,
        classes: {
          root: classes.card,
        },
      }}
    >
      {value.length > 0 ? (
        <BarChart issues={value} />
      ) : (
        <Typography>There are no issues for this project</Typography>
      )}
    </InfoCard>
  );
};
