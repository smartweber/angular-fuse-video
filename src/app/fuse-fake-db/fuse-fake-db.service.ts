import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ContactsFakeDb } from './contacts';
import { MailFakeDb } from './mail';
import { ProfileFakeDb } from './profile';
import { TodoFakeDb } from './todo';

export class FuseFakeDbService implements InMemoryDbService
{
  createDb()
  {
    return {
      // Mail
      'mail-mails'  : MailFakeDb.mails,
      'mail-folders': MailFakeDb.folders,
      'mail-filters': MailFakeDb.filters,
      'mail-labels' : MailFakeDb.labels,
      
      // Contacts
      'contacts-contacts': ContactsFakeDb.contacts,
      'contacts-user'    : ContactsFakeDb.user,

      // Profile
      'profile-timeline'     : ProfileFakeDb.timeline,
      'profile-photos-videos': ProfileFakeDb.photosVideos,
      'profile-about'        : ProfileFakeDb.about,
      
      // Todo
      'todo-todos'  : TodoFakeDb.todos,
      'todo-filters': TodoFakeDb.filters,
      'todo-tags'   : TodoFakeDb.tags
    };
  }
}
